# BitcoinVault Pro Frontend

Enterprise Bitcoin Treasury Management Platform - Frontend Application

## Overview

BitcoinVault Pro is a professional-grade Bitcoin treasury management platform built on Sui blockchain with dWallet Network integration. This frontend provides an intuitive interface for managing Bitcoin treasury operations, compliance monitoring, and risk assessment.

## Features

### 🔐 Secure Treasury Management
- Multi-signature Bitcoin vaults with programmable policies
- Real-time balance monitoring and transaction tracking
- Advanced spending controls and approval workflows

### 📊 Analytics & Reporting
- Portfolio analytics with real-time Bitcoin price data
- Risk assessment and compliance monitoring
- Transaction history and audit trails

### 🛡️ Compliance & Security
- Built-in KYC/AML verification
- Automated regulatory reporting
- Risk scoring and threat detection

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Professional Bitcoin-themed interface
- Real-time updates and notifications

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom Bitcoin theme
- **UI Components**: Radix UI primitives
- **State Management**: Zustand
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Blockchain Integration**: Sui SDK (ready for dWallet Network)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd btcvaultonsui/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   ├── button.tsx   # Button component
│   │   └── card.tsx     # Card component
│   └── Dashboard.tsx    # Main dashboard component
├── lib/                 # Utility functions
│   └── utils.ts         # Helper functions
├── store/               # State management
│   └── treasury.ts      # Treasury store (Zustand)
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles

```

## Key Components

### Dashboard
The main dashboard provides:
- Treasury vault overview
- Balance and portfolio analytics
- Recent transaction history
- Risk assessment metrics
- Quick action buttons

### Treasury Store
Centralized state management for:
- Vault data and configurations
- Transaction history and status
- Compliance records
- Loading states and error handling

### UI Components
Reusable components built with:
- Radix UI primitives for accessibility
- Tailwind CSS for styling
- TypeScript for type safety

## Smart Contract Integration

The frontend is designed to integrate with the BitcoinVault Pro smart contracts:

- **Package ID**: `0x6dbe0b8c4a3f4b2e1d7c9a8b5f3e2d1c0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4`
- **Enterprise Treasury**: Core treasury management
- **Bitcoin Operations**: Bitcoin transaction handling
- **Compliance Engine**: Regulatory compliance

## Demo Mode

The application includes a demo mode that showcases:
- Mock treasury vaults with realistic data
- Sample transactions and approvals
- Risk assessment examples
- Compliance monitoring interface

## Customization

### Theming
The application uses a custom Bitcoin-themed color palette:
- Primary colors: Bitcoin orange (#f97316)
- Gradients and accents for visual appeal
- Dark/light mode support

### Configuration
Key configuration options:
- Bitcoin price feeds (currently mocked)
- Vault display preferences
- Transaction filtering options
- Compliance rule settings

## Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create a `.env` file for production settings:
```env
VITE_SUI_NETWORK=mainnet
VITE_PACKAGE_ID=0x6dbe0b...
VITE_BTC_PRICE_API=https://api.coinbase.com/v2/exchange-rates
```

### Deployment Options
- **Vercel**: Automatic deployment from Git
- **Netlify**: Static site hosting
- **AWS S3**: Static website hosting
- **IPFS**: Decentralized hosting

## Security Considerations

- All sensitive operations require wallet connection
- Transaction signing happens client-side
- No private keys stored in frontend
- HTTPS required for production
- Content Security Policy recommended

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the Apache 2.0 License.

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation

## Roadmap

### Phase 1 (Current)
- ✅ Core dashboard interface
- ✅ Treasury vault management
- ✅ Transaction monitoring
- ✅ Basic compliance features

### Phase 2 (Next)
- [ ] Real-time Sui wallet integration
- [ ] Advanced analytics charts
- [ ] Multi-vault management
- [ ] Enhanced compliance reporting

### Phase 3 (Future)
- [ ] Mobile responsive design
- [ ] Advanced risk modeling
- [ ] Integration with external services
- [ ] Multi-language support

---

Built with ❤️ for the Bitcoin treasury management community.
