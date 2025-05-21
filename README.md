# BitcoinVault Pro - Enterprise Bitcoin Treasury Management Platform

> **Professional-grade Bitcoin treasury management for institutions, DAOs, and enterprises**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Sui Framework](https://img.shields.io/badge/Sui-Framework-blue)](https://sui.io)
[![dWallet Network](https://img.shields.io/badge/dWallet-Network-green)](https://dwallet.io)

## 🚀 Overview

BitcoinVault Pro is an enterprise-grade Bitcoin treasury management platform built on the Sui blockchain, leveraging dWallet Network's programmable custody technology. It provides sophisticated treasury operations, compliance automation, and multi-signature governance for institutional Bitcoin holdings.

### 🎯 Key Innovations

- **Programmable Custody**: Integration with dWallet Network for secure Bitcoin signing without private key exposure
- **Dynamic Governance**: Flexible multi-signature policies with time-based controls and risk assessment
- **Compliance Automation**: Built-in AML/KYC verification, sanctions screening, and regulatory reporting
- **Treasury Analytics**: AI-powered insights, risk scoring, and predictive analytics
- **Emergency Controls**: Sophisticated emergency response procedures and fast-track approvals

## 🏗️ Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    BitcoinVault Pro                         │
├─────────────────────────────────────────────────────────────┤
│  Frontend (TypeScript + Lit Web Components)                │
│  ├── Treasury Dashboard                                     │
│  ├── Proposal Management                                    │
│  ├── Compliance Monitoring                                  │
│  └── Analytics & Reporting                                  │
├─────────────────────────────────────────────────────────────┤
│  Smart Contracts (Move on Sui)                             │
│  ├── Enterprise Treasury (863 lines)                       │
│  ├── Bitcoin Operations (778 lines)                        │
│  └── Compliance Engine (918 lines)                         │
├─────────────────────────────────────────────────────────────┤
│  dWallet Network Integration                               │
│  ├── Bitcoin Signing                                       │
│  ├── Multi-Party Computation                               │
│  └── Programmable Custody                                  │
└─────────────────────────────────────────────────────────────┘
```

### Smart Contract Modules

#### 1. Enterprise Treasury (`enterprise_treasury.move`)
- **TreasuryVault**: Core treasury management with programmable policies
- **SpendingPolicy**: Dynamic spending controls with time locks and approval thresholds
- **GovernanceConfig**: Multi-signature governance with weighted voting
- **AnalyticsEngine**: AI-powered treasury insights and risk assessment
- **EmergencyConfig**: Emergency response procedures and fast-track approvals

#### 2. Bitcoin Operations (`bitcoin_operations.move`)
- **BitcoinTransaction**: Bitcoin transaction creation and management
- **UTXOManager**: UTXO selection and management strategies
- **TransactionStatus**: Real-time transaction monitoring and confirmation tracking
- **FeeEstimation**: Dynamic fee calculation and optimization

#### 3. Compliance Engine (`compliance_engine.move`)
- **ComplianceProfile**: Comprehensive KYC/AML verification
- **SanctionsScreening**: Global watchlist screening and monitoring
- **RiskAssessment**: Multi-dimensional risk scoring and analysis
- **AuditTrailEntry**: Immutable audit trail for regulatory compliance

## 🛠️ Technology Stack

### Blockchain & Smart Contracts
- **Sui Framework**: High-performance blockchain with object-centric architecture
- **Move Language**: Safe and expressive smart contract programming
- **dWallet Network**: Programmable custody and Bitcoin signing infrastructure

### Frontend & UI
- **TypeScript**: Type-safe development environment
- **Lit Web Components**: Modern, lightweight web components
- **Vite**: Fast build tool and development server
- **Storybook**: Component development and documentation

### Development Tools
- **Sui CLI**: Smart contract compilation and deployment
- **ESLint & Prettier**: Code quality and formatting
- **TypeScript Compiler**: Type checking and compilation

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended package manager)
- **Sui CLI** (latest version)
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/btcvaultonsui.git
cd btcvaultonsui
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
pnpm install

# Return to root directory
cd ..
pnpm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
# Sui Network Configuration
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# dWallet Network Configuration
DWALLET_NETWORK_URL=https://rpc.testnet.dwallet.io
DWALLET_PACKAGE_ID=0x...

# Treasury Configuration
TREASURY_NAME="Your Enterprise Treasury"
TREASURY_ORGANIZATION="Your Organization"
COMPLIANCE_JURISDICTION="US"

# API Keys (for compliance providers)
CHAINALYSIS_API_KEY=your_api_key
ELLIPTIC_API_KEY=your_api_key
```

### 4. Compile Smart Contracts

```bash
# Compile Move contracts
sui move build

# Run tests
sui move test
```

### 5. Deploy Contracts

```bash
# Deploy to testnet
sui client publish --gas-budget 100000000

# Note the package ID for frontend configuration
```

### 6. Start Development Server

```bash
# Start frontend development server
cd frontend
pnpm dev

# Start Storybook for component development
pnpm storybook
```

## 🚀 Usage Guide

### Creating a Treasury Vault

```typescript
import { BitcoinVaultSDK } from './src/sdk';

const sdk = new BitcoinVaultSDK({
  suiClient: suiClient,
  dwalletConfig: dwalletConfig
});

// Create a new treasury vault
const treasury = await sdk.createTreasuryVault({
  name: "Enterprise Treasury",
  description: "Main corporate Bitcoin treasury",
  organization: "Acme Corp",
  requiredSigners: [address1, address2, address3],
  minApprovalThreshold: 2,
  bitcoinAddress: "bc1q..." // Generated from dWallet
});
```

### Proposing an Expenditure

```typescript
// Create expenditure proposal
const proposal = await sdk.proposeExpenditure({
  treasuryId: treasury.id,
  amount: 100000000, // 1 BTC in satoshis
  recipient: "bc1qrecipient...",
  purpose: "Vendor payment for Q4 services",
  urgency: 5, // Medium urgency (1-10 scale)
  policyType: POLICY_STANDARD
});
```

### Approval Workflow

```typescript
// Approve proposal (requires authorized signer)
await sdk.approveProposal({
  proposalId: proposal.id,
  approverSignature: signature
});

// Execute approved proposal
await sdk.executeProposal({
  proposalId: proposal.id,
  executorSignature: signature
});
```

### Compliance Verification

```typescript
// Perform compliance check
const complianceResult = await sdk.performComplianceCheck({
  proposalId: proposal.id,
  recipientAddress: "bc1qrecipient...",
  amount: 100000000,
  jurisdiction: "US"
});

// Review compliance status
if (complianceResult.status === "APPROVED") {
  console.log("Compliance check passed");
} else {
  console.log("Compliance issues:", complianceResult.issues);
}
```

## 🔧 Configuration

### Spending Policies

Configure different spending policies for various use cases:

```typescript
const policies = {
  STANDARD: {
    maxAmountPerTx: 1000000000, // 10 BTC
    dailyLimit: 5000000000,     // 50 BTC
    requiredApprovals: 2,
    timeLockDuration: 3600000,  // 1 hour
    complianceRequired: true
  },
  HIGH_VALUE: {
    maxAmountPerTx: 10000000000, // 100 BTC
    dailyLimit: 20000000000,     // 200 BTC
    requiredApprovals: 3,
    timeLockDuration: 86400000,  // 24 hours
    complianceRequired: true
  },
  EMERGENCY: {
    maxAmountPerTx: 500000000,   // 5 BTC
    dailyLimit: 1000000000,      // 10 BTC
    requiredApprovals: 1,
    timeLockDuration: 0,         // No time lock
    complianceRequired: false
  }
};
```

### Governance Configuration

```typescript
const governance = {
  requiredSigners: [
    "0x1234...", // CFO
    "0x5678...", // CTO
    "0x9abc...", // CEO
    "0xdef0..."  // Compliance Officer
  ],
  memberWeights: {
    "0x1234...": 100, // CFO - highest weight
    "0x5678...": 80,  // CTO
    "0x9abc...": 100, // CEO - highest weight
    "0xdef0...": 60   // Compliance Officer
  },
  minApprovalThreshold: 2,
  maxApprovalThreshold: 4
};
```

## 🔒 Security Features

### Multi-Signature Security
- **dWallet Integration**: No private key exposure, cryptographic security
- **Threshold Signatures**: Configurable M-of-N signature schemes
- **Time Locks**: Mandatory waiting periods for large transactions
- **Emergency Controls**: Fast-track procedures for urgent situations

### Compliance & Risk Management
- **AML/KYC Verification**: Automated identity verification
- **Sanctions Screening**: Real-time watchlist monitoring
- **Risk Scoring**: AI-powered transaction risk assessment
- **Audit Trails**: Immutable compliance records

### Access Controls
- **Role-Based Permissions**: Granular access control system
- **Multi-Factor Authentication**: Enhanced security for sensitive operations
- **Session Management**: Secure session handling and timeout controls
- **IP Whitelisting**: Network-level access restrictions

## 📊 Analytics & Reporting

### Treasury Analytics
- **Balance Tracking**: Real-time treasury balance monitoring
- **Transaction Analysis**: Pattern recognition and anomaly detection
- **Performance Metrics**: Treasury efficiency and cost analysis
- **Predictive Insights**: AI-powered forecasting and recommendations

### Compliance Reporting
- **Regulatory Reports**: Automated compliance report generation
- **Audit Trails**: Comprehensive transaction and approval histories
- **Risk Assessments**: Detailed risk analysis and mitigation strategies
- **Sanctions Monitoring**: Continuous watchlist screening reports

## 🧪 Testing

### Running Tests

```bash
# Run Move contract tests
sui move test

# Run frontend tests
cd frontend
pnpm test

# Run integration tests
pnpm test:integration

# Run compliance tests
pnpm test:compliance
```

### Test Coverage

- **Unit Tests**: Individual function and module testing
- **Integration Tests**: End-to-end workflow testing
- **Security Tests**: Vulnerability and attack vector testing
- **Compliance Tests**: Regulatory requirement validation

## 🚀 Deployment

### Testnet Deployment

```bash
# Deploy to Sui testnet
sui client publish --gas-budget 100000000

# Configure frontend with deployed package ID
export VITE_PACKAGE_ID="0x..."

# Deploy frontend
cd frontend
pnpm build
pnpm deploy:testnet
```

### Mainnet Deployment

```bash
# Switch to mainnet
sui client switch --env mainnet

# Deploy contracts
sui client publish --gas-budget 200000000

# Deploy frontend to production
cd frontend
pnpm build
pnpm deploy:production
```

## 📚 API Reference

### Core SDK Methods

#### Treasury Management
- `createTreasuryVault()` - Create new treasury vault
- `updateTreasuryConfig()` - Update treasury configuration
- `getTreasuryBalance()` - Get current treasury balance
- `getTreasuryHistory()` - Get transaction history

#### Proposal Management
- `proposeExpenditure()` - Create expenditure proposal
- `approveProposal()` - Approve pending proposal
- `executeProposal()` - Execute approved proposal
- `cancelProposal()` - Cancel pending proposal

#### Compliance Operations
- `performComplianceCheck()` - Run compliance verification
- `updateComplianceProfile()` - Update entity compliance profile
- `generateComplianceReport()` - Generate compliance reports
- `screenSanctions()` - Perform sanctions screening

## 🤝 Contributing

We welcome contributions to BitcoinVault Pro! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards

- Follow TypeScript and Move best practices
- Maintain test coverage above 90%
- Document all public APIs
- Use conventional commit messages

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [User Guide](docs/user-guide.md)
- [Developer Guide](docs/developer-guide.md)
- [Compliance Guide](docs/compliance.md)

### Community
- [Discord](https://discord.gg/bitcoinvault)
- [Telegram](https://t.me/bitcoinvaultpro)
- [Twitter](https://twitter.com/bitcoinvaultpro)

### Enterprise Support
For enterprise support and custom implementations, contact: enterprise@bitcoinvault.pro

## 🔮 Roadmap

### Q1 2024
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Hardware wallet integration

### Q2 2024
- [ ] DeFi protocol integrations
- [ ] Automated rebalancing
- [ ] Advanced reporting tools
- [ ] API marketplace

### Q3 2024
- [ ] Institutional custody partnerships
- [ ] Regulatory compliance automation
- [ ] AI-powered risk management
- [ ] Cross-chain treasury management

---

**Built with ❤️ by the BitcoinVault Pro Team**

*Empowering enterprises with secure, compliant, and intelligent Bitcoin treasury management.*
