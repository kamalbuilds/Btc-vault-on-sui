# BitcoinVault Pro - Enterprise Bitcoin Treasury Management

A production-ready enterprise Bitcoin treasury management platform built on Sui blockchain with dWallet Network integration for programmable Bitcoin custody.

## 🚀 Features

### Real Blockchain Integration
- **Sui dApp Kit Integration**: Full integration with Mysten Labs dApp Kit for wallet connection and transaction signing
- **dWallet Network**: Programmable Bitcoin custody using dWallet Network's MPC technology
- **Smart Contract Integration**: Direct interaction with deployed Move smart contracts on Sui testnet
- **Real-time Data**: Live blockchain data fetching and transaction monitoring

### Enterprise Treasury Management
- **Multi-signature Vaults**: Configurable approval thresholds and authorized signers
- **Spending Policies**: Daily, monthly, and per-transaction limits
- **Compliance Engine**: AML/KYC verification and sanctions screening
- **Risk Assessment**: Real-time transaction risk scoring
- **Audit Trails**: Complete transaction history and compliance logs

### Bitcoin Operations
- **dWallet Integration**: Secure Bitcoin transaction creation and signing
- **Address Generation**: Deterministic Bitcoin address derivation
- **Fee Estimation**: Dynamic Bitcoin network fee calculation
- **Transaction Broadcasting**: Direct Bitcoin network interaction
- **Status Monitoring**: Real-time transaction confirmation tracking

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Zustand** for state management
- **Lucide React** for icons

### Blockchain Integration
- **@mysten/dapp-kit**: Sui wallet connection and transaction signing
- **@mysten/sui**: Sui blockchain client and utilities
- **dWallet Network SDK**: Bitcoin MPC operations

### Smart Contracts
- **Package ID**: `0x6dbe0b8c4a3f4b2e1d7c9a8b5f3e2d1c0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4`
- **Modules**:
  - `enterprise_treasury`: Treasury vault management
  - `bitcoin_operations`: Bitcoin transaction operations
  - `compliance_engine`: Regulatory compliance

## 🛠️ Installation

### Prerequisites
- Node.js 18+ or Bun
- Sui wallet (Sui Wallet, Ethos, etc.)
- Access to Sui testnet

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd btcvaultonsui/frontend

# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
VITE_SUI_NETWORK=testnet
VITE_PACKAGE_ID=0x6dbe0b8c4a3f4b2e1d7c9a8b5f3e2d1c0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4
VITE_DWALLET_IKA_PACKAGE_ID=0x1
VITE_DWALLET_SYSTEM_PACKAGE_ID=0x2
VITE_DWALLET_SYSTEM_OBJECT_ID=0x3
```

### Network Configuration
The app is configured to work with:
- **Sui Testnet**: For smart contract interactions
- **Bitcoin Testnet**: For Bitcoin operations (via dWallet)
- **dWallet Network**: For MPC Bitcoin custody

## 📱 Usage

### Wallet Connection
1. Click "Connect Wallet" on the landing page
2. Select your preferred Sui wallet
3. Approve the connection request
4. Access the treasury dashboard

### Creating Treasury Vaults
1. Navigate to the dashboard
2. Click "Create Vault"
3. Configure vault parameters:
   - Name and description
   - Spending limits (daily, monthly, per-transaction)
   - Approval threshold
   - Authorized signers
4. Sign the transaction to create the vault

### Bitcoin Operations
1. Select a treasury vault
2. Click "Send Bitcoin"
3. Enter recipient address and amount
4. Review transaction details and risk assessment
5. Submit for approval (if required) or execute immediately
6. Monitor transaction status and confirmations

### Compliance Features
- **AML Screening**: Automatic address screening against sanctions lists
- **KYC Verification**: Identity verification for authorized signers
- **Risk Assessment**: ML-based transaction risk scoring
- **Audit Logs**: Complete transaction and approval history

## 🔐 Security Features

### Multi-signature Security
- Configurable approval thresholds (1-of-N to N-of-N)
- Hardware wallet support via Sui wallets
- Time-locked transactions for large amounts

### dWallet MPC Security
- Distributed key generation and signing
- No single point of failure
- Threshold signature schemes
- Secure multi-party computation

### Smart Contract Security
- Formal verification of Move contracts
- Capability-based access control
- Immutable spending policies
- Emergency pause mechanisms

## 🧪 Testing

### Unit Tests
```bash
bun run test
```

### Integration Tests
```bash
bun run test:integration
```

### E2E Tests
```bash
bun run test:e2e
```

## 📊 Monitoring and Analytics

### Real-time Metrics
- Total treasury balance across all vaults
- Transaction volume and frequency
- Risk score distributions
- Compliance status overview

### Reporting
- Daily/monthly treasury reports
- Compliance audit reports
- Transaction history exports
- Risk assessment summaries

## 🚀 Deployment

### Production Build
```bash
bun run build
```

### Deployment Options
- **Vercel**: Optimized for React applications
- **Netlify**: Static site hosting with edge functions
- **AWS S3 + CloudFront**: Scalable static hosting
- **IPFS**: Decentralized hosting

### Environment Setup
1. Configure production environment variables
2. Update smart contract package IDs
3. Set up monitoring and alerting
4. Configure backup and disaster recovery

## 🔗 API Integration

### Sui Blockchain
```typescript
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit'
import { SuiTreasuryService } from './lib/sui-integration'

const client = useSuiClient()
const treasuryService = new SuiTreasuryService(client)
```

### dWallet Network
```typescript
import { DWalletBitcoinService } from './lib/dwallet-integration'

const dwalletService = new DWalletBitcoinService(client)
await dwalletService.initializeDWallet(keypair, encryptedKeypair, seed)
```

## 📚 Documentation

### Smart Contract Documentation
- [Enterprise Treasury Module](../contracts/sources/enterprise_treasury.move)
- [Bitcoin Operations Module](../contracts/sources/bitcoin_operations.move)
- [Compliance Engine Module](../contracts/sources/compliance_engine.move)

### API Reference
- [Sui Integration API](./src/lib/sui-integration.ts)
- [dWallet Integration API](./src/lib/dwallet-integration.ts)
- [Treasury Service Hook](./src/hooks/useTreasuryService.ts)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email: support@bitcoinvaultpro.com

## 🔮 Roadmap

### Q1 2024
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Hardware wallet integration

### Q2 2024
- [ ] Institutional custody features
- [ ] Regulatory reporting automation
- [ ] API for third-party integrations
- [ ] Advanced risk management tools

---

**Built with ❤️ using Sui blockchain and dWallet Network**
