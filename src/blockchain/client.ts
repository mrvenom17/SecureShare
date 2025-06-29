import { ethers } from 'ethers';
import { TransactionResult } from './types';
import { createContract } from './services/contract';

class BlockchainClient {
  private contract: ethers.Contract;

  constructor() {
    this.contract = createContract();
  }

  async uploadFile(
    fileId: string, 
    hash: string, 
    signer: ethers.Signer
  ): Promise<TransactionResult> {
    try {
      const connectedContract = this.contract.connect(signer);
      const tx = await connectedContract.uploadFile(fileId, hash);
      await tx.wait();
      return { hash: tx.hash, success: true };
    } catch (error) {
      return { 
        hash: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async grantAccess(
    fileId: string, 
    userAddress: string, 
    signer: ethers.Signer
  ): Promise<TransactionResult> {
    try {
      const connectedContract = this.contract.connect(signer);
      const tx = await connectedContract.grantAccess(fileId, userAddress);
      await tx.wait();
      return { hash: tx.hash, success: true };
    } catch (error) {
      return { 
        hash: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async revokeAccess(
    fileId: string, 
    userAddress: string, 
    signer: ethers.Signer
  ): Promise<TransactionResult> {
    try {
      const connectedContract = this.contract.connect(signer);
      const tx = await connectedContract.revokeAccess(fileId, userAddress);
      await tx.wait();
      return { hash: tx.hash, success: true };
    } catch (error) {
      return { 
        hash: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async hasAccess(fileId: string, userAddress: string): Promise<boolean> {
    return await this.contract.hasAccess(fileId, userAddress);
  }
}

// Export a singleton instance
export const blockchainClient = new BlockchainClient();