import { getContract } from 'viem';
import { CONTRACT_ABI } from '../config/contract';
import { getBlockchainConfig } from '../config/environment';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

export const createContract = () => {
  const config = getBlockchainConfig();
  
  const client = createPublicClient({
    chain: sepolia,
    transport: http()
  });

  return getContract({
    address: config.contractAddress as `0x${string}`,
    abi: CONTRACT_ABI,
    publicClient: client,
  });
};