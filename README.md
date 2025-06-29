# SecureShare Elite

Enterprise-grade secure data sharing platform built on blockchain technology.

## 🚀 Features

- **Blockchain-based Access Control**: Immutable file permissions on Ethereum
- **Zero-Knowledge Proofs**: Verify access without revealing file metadata
- **Enterprise SSO**: SAML, OIDC, and LDAP integration
- **Compliance Center**: GDPR, HIPAA, SOX compliance monitoring
- **Layer 2 Integration**: Reduced gas fees with Arbitrum, Optimism, Polygon
- **Advanced Analytics**: Comprehensive usage and security analytics
- **PWA Support**: Offline capabilities and native app experience

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Blockchain**: Ethereum, Wagmi, Viem, Hardhat
- **Smart Contracts**: Solidity 0.8.19, OpenZeppelin
- **State Management**: Zustand
- **Build Tool**: Vite
- **Testing**: Hardhat, Chai

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrvenom17/SecureShare
   cd secureshare-elite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🔧 Smart Contract Deployment

### Prerequisites

1. **Get an Infura API Key**
   - Sign up at [Infura.io](https://infura.io)
   - Create a new project
   - Copy the API key to `VITE_INFURA_API_KEY` in `.env`

2. **Set up deployment wallet**
   - Add your private key to `PRIVATE_KEY` in `.env`
   - Ensure the wallet has sufficient ETH for deployment

3. **Get Etherscan API Key (optional)**
   - Sign up at [Etherscan.io](https://etherscan.io)
   - Get API key for contract verification

### Deploy to Sepolia Testnet

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy:sepolia

# Verify contract (optional)
npm run verify <CONTRACT_ADDRESS>
```

### Deploy to Local Network

```bash
# Start local Hardhat network
npx hardhat node

# Deploy to local network
npm run deploy:local
```

## 🧪 Testing

```bash
# Run smart contract tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/SecureShare.test.ts
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Smart Contract Functions

### Core Functions

- `uploadFile(bytes32 fileId, string ipfsHash)` - Upload a new file
- `grantAccess(bytes32 fileId, address user)` - Grant file access
- `revokeAccess(bytes32 fileId, address user)` - Revoke file access
- `hasAccess(bytes32 fileId, address user)` - Check access permissions

### View Functions

- `getFileInfo(bytes32 fileId)` - Get file details
- `getUserFiles(address user)` - Get user's owned files
- `getUserAccessFiles(address user)` - Get user's accessible files
- `getTotalFiles()` - Get total file count

## 🔐 Security Features

- **Access Control**: Role-based permissions with smart contracts
- **Encryption**: Client-side encryption before IPFS storage
- **Audit Trail**: Immutable blockchain transaction history
- **Zero-Knowledge Proofs**: Privacy-preserving access verification
- **Multi-Factor Authentication**: Enterprise SSO integration

## 🌐 Network Support

- **Ethereum Mainnet**: Production deployment
- **Sepolia Testnet**: Development and testing
- **Layer 2 Networks**: Arbitrum, Optimism, Polygon
- **Local Development**: Hardhat network

## 📊 Analytics & Monitoring

- Real-time usage analytics
- Security event monitoring
- Compliance reporting
- Performance metrics
- User activity tracking

## 🔧 Configuration

### Environment Variables

```env
# Blockchain
VITE_ETHEREUM_NETWORK=sepolia
VITE_CONTRACT_ADDRESS=0x...
VITE_INFURA_API_KEY=your_infura_key

# Deployment
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

### Supported Networks

- **Sepolia**: Chain ID 11155111
- **Ethereum Mainnet**: Chain ID 1
- **Arbitrum One**: Chain ID 42161
- **Optimism**: Chain ID 10
- **Polygon**: Chain ID 137

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the test files for usage examples

## 🎯 Roadmap

- [ ] Multi-chain deployment
- [ ] Advanced ZK-proof implementations
- [ ] Mobile app development
- [ ] Enterprise API gateway
- [ ] Advanced compliance features
