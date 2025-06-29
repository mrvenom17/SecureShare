import { BlockchainConfig } from '../types';

export const getBlockchainConfig = (): BlockchainConfig => ({
  network: import.meta.env.VITE_ETHEREUM_NETWORK || 'sepolia',
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '',
  infuraApiKey: import.meta.env.VITE_INFURA_API_KEY || ''
});