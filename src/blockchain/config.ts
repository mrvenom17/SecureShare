// Use Vite's import.meta.env instead of process.env
export const ETHEREUM_NETWORK = import.meta.env.VITE_ETHEREUM_NETWORK || 'sepolia';
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';
export const CONTRACT_ABI = [
  // Access Control Events
  "event AccessGranted(address indexed owner, address indexed user, bytes32 indexed fileId)",
  "event AccessRevoked(address indexed owner, address indexed user, bytes32 indexed fileId)",
  
  // File Management Events
  "event FileUploaded(address indexed owner, bytes32 indexed fileId, string hash)",
  
  // Core Functions
  "function uploadFile(bytes32 fileId, string hash) external",
  "function grantAccess(bytes32 fileId, address user) external",
  "function revokeAccess(bytes32 fileId, address user) external",
  "function hasAccess(bytes32 fileId, address user) external view returns (bool)",
];