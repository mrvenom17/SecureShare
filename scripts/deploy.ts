import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Starting SecureShare contract deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Check deployer balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the SecureShare contract
  console.log("📦 Deploying SecureShare contract...");
  const SecureShare = await ethers.getContractFactory("SecureShare");
  const secureShare = await SecureShare.deploy();

  await secureShare.waitForDeployment();
  const contractAddress = await secureShare.getAddress();

  console.log("✅ SecureShare deployed to:", contractAddress);
  console.log("🔗 Transaction hash:", secureShare.deploymentTransaction()?.hash);

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const totalFiles = await secureShare.getTotalFiles();
  console.log("📊 Initial total files:", totalFiles.toString());

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: (await deployer.provider.getNetwork()).name,
    chainId: (await deployer.provider.getNetwork()).chainId,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    transactionHash: secureShare.deploymentTransaction()?.hash,
  };

  // Update .env file with contract address
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add contract address
  const contractAddressLine = `VITE_CONTRACT_ADDRESS=${contractAddress}`;
  if (envContent.includes('VITE_CONTRACT_ADDRESS=')) {
    envContent = envContent.replace(/VITE_CONTRACT_ADDRESS=.*/, contractAddressLine);
  } else {
    envContent += `\n${contractAddressLine}`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log("📝 Updated .env file with contract address");

  // Save deployment details
  const deploymentPath = path.join(process.cwd(), 'deployments.json');
  let deployments = {};
  
  if (fs.existsSync(deploymentPath)) {
    deployments = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  }

  deployments[deploymentInfo.network] = deploymentInfo;
  fs.writeFileSync(deploymentPath, JSON.stringify(deployments, null, 2));

  console.log("💾 Deployment info saved to deployments.json");
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Update your frontend to use the new contract address");
  console.log("2. Test the contract functions");
  console.log("3. Verify the contract on Etherscan (if on mainnet/testnet)");
  
  if (deploymentInfo.network !== "hardhat" && deploymentInfo.network !== "localhost") {
    console.log(`\n🔍 Verify command:`);
    console.log(`npx hardhat verify --network ${deploymentInfo.network} ${contractAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });