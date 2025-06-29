import { ethers } from 'ethers';
import { getBlockchainConfig } from '../config/environment';

export const createProvider = (): ethers.Provider => {
  const config = getBlockchainConfig();
  return new ethers.JsonRpcProvider(
    `https://${config.network}.infura.io/v3/${config.infuraApiKey}`
  );
};