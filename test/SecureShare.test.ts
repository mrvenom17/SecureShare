import { expect } from "chai";
import { ethers } from "hardhat";
import { SecureShare } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SecureShare", function () {
  let secureShare: SecureShare;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const fileId = ethers.keccak256(ethers.toUtf8Bytes("test-file-1"));
  const ipfsHash = "QmTestHash123456789";

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const SecureShare = await ethers.getContractFactory("SecureShare");
    secureShare = await SecureShare.deploy();
    await secureShare.waitForDeployment();
  });

  describe("File Upload", function () {
    it("Should upload a file successfully", async function () {
      await expect(secureShare.uploadFile(fileId, ipfsHash))
        .to.emit(secureShare, "FileUploaded")
        .withArgs(owner.address, fileId, ipfsHash, await ethers.provider.getBlock("latest").then(b => b!.timestamp + 1));

      const totalFiles = await secureShare.getTotalFiles();
      expect(totalFiles).to.equal(1);
    });

    it("Should not allow duplicate file uploads", async function () {
      await secureShare.uploadFile(fileId, ipfsHash);
      
      await expect(secureShare.uploadFile(fileId, ipfsHash))
        .to.be.revertedWith("File already exists");
    });

    it("Should not allow empty IPFS hash", async function () {
      await expect(secureShare.uploadFile(fileId, ""))
        .to.be.revertedWith("IPFS hash cannot be empty");
    });
  });

  describe("Access Control", function () {
    beforeEach(async function () {
      await secureShare.uploadFile(fileId, ipfsHash);
    });

    it("Should grant access to a user", async function () {
      await expect(secureShare.grantAccess(fileId, user1.address))
        .to.emit(secureShare, "AccessGranted")
        .withArgs(owner.address, user1.address, fileId);

      const hasAccess = await secureShare.hasAccess(fileId, user1.address);
      expect(hasAccess).to.be.true;
    });

    it("Should revoke access from a user", async function () {
      await secureShare.grantAccess(fileId, user1.address);
      
      await expect(secureShare.revokeAccess(fileId, user1.address))
        .to.emit(secureShare, "AccessRevoked")
        .withArgs(owner.address, user1.address, fileId);

      const hasAccess = await secureShare.hasAccess(fileId, user1.address);
      expect(hasAccess).to.be.false;
    });

    it("Should not allow non-owners to grant access", async function () {
      await expect(secureShare.connect(user1).grantAccess(fileId, user2.address))
        .to.be.revertedWith("Not file owner");
    });

    it("Should not allow granting access to self", async function () {
      await expect(secureShare.grantAccess(fileId, owner.address))
        .to.be.revertedWith("Cannot grant access to yourself");
    });
  });

  describe("File Information", function () {
    beforeEach(async function () {
      await secureShare.uploadFile(fileId, ipfsHash);
    });

    it("Should return file info for owner", async function () {
      const [fileOwner, hash, timestamp] = await secureShare.getFileInfo(fileId);
      
      expect(fileOwner).to.equal(owner.address);
      expect(hash).to.equal(ipfsHash);
      expect(timestamp).to.be.gt(0);
    });

    it("Should return file info for authorized user", async function () {
      await secureShare.grantAccess(fileId, user1.address);
      
      const [fileOwner, hash, timestamp] = await secureShare.connect(user1).getFileInfo(fileId);
      
      expect(fileOwner).to.equal(owner.address);
      expect(hash).to.equal(ipfsHash);
    });

    it("Should not return file info for unauthorized user", async function () {
      await expect(secureShare.connect(user1).getFileInfo(fileId))
        .to.be.revertedWith("No access to file");
    });
  });

  describe("User Files", function () {
    it("Should track user's owned files", async function () {
      await secureShare.uploadFile(fileId, ipfsHash);
      
      const userFiles = await secureShare.getUserFiles(owner.address);
      expect(userFiles).to.have.lengthOf(1);
      expect(userFiles[0]).to.equal(fileId);
    });

    it("Should track user's accessible files", async function () {
      await secureShare.uploadFile(fileId, ipfsHash);
      await secureShare.grantAccess(fileId, user1.address);
      
      const accessFiles = await secureShare.getUserAccessFiles(user1.address);
      expect(accessFiles).to.have.lengthOf(1);
      expect(accessFiles[0]).to.equal(fileId);
    });
  });
});