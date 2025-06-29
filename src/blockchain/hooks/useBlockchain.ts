import { useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { getContract } from 'viem';
import { CONTRACT_ABI } from '../config/contract';
import { getBlockchainConfig } from '../config/environment';

export function useBlockchain() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const config = getBlockchainConfig();

  const getContractInstance = useCallback(() => {
    return getContract({
      address: config.contractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      publicClient,
      walletClient: walletClient || undefined,
    });
  }, [publicClient, walletClient, config.contractAddress]);

  const uploadFile = useCallback(async (fileId: string, fileHash: string) => {
    if (!walletClient || !isConnected) {
      throw new Error('Wallet not connected');
    }

    const contract = getContractInstance();
    const txHash = await contract.write.uploadFile([fileId, fileHash]);
    return txHash;
  }, [walletClient, isConnected, getContractInstance]);

  const grantAccess = useCallback(async (fileId: string, userAddress: string) => {
    if (!walletClient || !isConnected) {
      throw new Error('Wallet not connected');
    }

    const contract = getContractInstance();
    const txHash = await contract.write.grantAccess([fileId, userAddress]);
    return txHash;
  }, [walletClient, isConnected, getContractInstance]);

  const revokeAccess = useCallback(async (fileId: string, userAddress: string) => {
    if (!walletClient || !isConnected) {
      throw new Error('Wallet not connected');
    }

    const contract = getContractInstance();
    const txHash = await contract.write.revokeAccess([fileId, userAddress]);
    return txHash;
  }, [walletClient, isConnected, getContractInstance]);

  const checkAccess = useCallback(async (fileId: string, userAddress: string) => {
    const contract = getContractInstance();
    return await contract.read.hasAccess([fileId, userAddress]);
  }, [getContractInstance]);

  return {
    uploadFile,
    grantAccess,
    revokeAccess,
    checkAccess,
    isConnected,
    address,
    connected: isConnected
  };
}