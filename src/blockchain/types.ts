export interface BlockchainConfig {
  network: string;
  contractAddress: string;
  infuraApiKey: string;
}

export interface TransactionResult {
  hash: string;
  success: boolean;
  error?: string;
}