# BitcoinVault Pro Frontend

> Modern TypeScript frontend for BitcoinVault Pro enterprise treasury management platform

## 🚀 Overview

The BitcoinVault Pro frontend is built with modern web technologies, providing a professional and intuitive interface for enterprise Bitcoin treasury management. It leverages Lit web components for modularity and the Sui TypeScript SDK for blockchain interactions.

## 🛠️ Technology Stack

- **TypeScript**: Type-safe development with full IDE support
- **Lit Web Components**: Lightweight, fast, and framework-agnostic components
- **Vite**: Lightning-fast build tool and development server
- **Sui TypeScript SDK**: Official Sui blockchain integration
- **dWallet SDK**: Programmable custody and Bitcoin signing
- **Storybook**: Component development and documentation

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Git

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Start Storybook for component development
pnpm storybook
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Lit web components
│   │   ├── treasury/        # Treasury management components
│   │   ├── proposals/       # Proposal workflow components
│   │   ├── compliance/      # Compliance monitoring components
│   │   ├── analytics/       # Analytics and reporting components
│   │   └── common/          # Shared UI components
│   ├── services/            # Business logic and API services
│   │   ├── treasury.ts      # Treasury management service
│   │   ├── bitcoin.ts       # Bitcoin operations service
│   │   ├── compliance.ts    # Compliance verification service
│   │   └── dwallet.ts       # dWallet integration service
│   ├── stores/              # State management
│   │   ├── treasury.ts      # Treasury state store
│   │   ├── user.ts          # User authentication store
│   │   └── app.ts           # Global application state
│   ├── types/               # TypeScript type definitions
│   │   ├── treasury.ts      # Treasury-related types
│   │   ├── bitcoin.ts       # Bitcoin transaction types
│   │   └── compliance.ts    # Compliance data types
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts    # Data formatting utilities
│   │   ├── validators.ts    # Input validation
│   │   └── constants.ts     # Application constants
│   ├── styles/              # Global styles and themes
│   │   ├── global.css       # Global CSS variables
│   │   ├── components.css   # Component-specific styles
│   │   └── themes.css       # Theme definitions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite type definitions
├── public/                  # Static assets
│   ├── icons/               # Application icons
│   ├── images/              # Images and graphics
│   └── favicon.ico          # Favicon
├── .storybook/              # Storybook configuration
│   ├── main.ts              # Storybook main config
│   ├── preview.ts           # Global story settings
│   └── manager.ts           # Storybook manager config
├── stories/                 # Component stories
│   ├── treasury/            # Treasury component stories
│   ├── proposals/           # Proposal component stories
│   └── compliance/          # Compliance component stories
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── README.md                # This file
```

## 🧩 Key Components

### Treasury Management

#### TreasuryDashboard
```typescript
import './components/treasury/treasury-dashboard';

<treasury-dashboard
  .treasuryId=${treasuryId}
  .balance=${balance}
  .policies=${policies}
  @policy-updated=${this.handlePolicyUpdate}
></treasury-dashboard>
```

#### TreasuryVaultCreator
```typescript
import './components/treasury/treasury-vault-creator';

<treasury-vault-creator
  .dwalletConfig=${dwalletConfig}
  @vault-created=${this.handleVaultCreated}
></treasury-vault-creator>
```

### Proposal Management

#### ProposalCreator
```typescript
import './components/proposals/proposal-creator';

<proposal-creator
  .treasuryId=${treasuryId}
  .availablePolicies=${policies}
  @proposal-created=${this.handleProposalCreated}
></proposal-creator>
```

#### ProposalList
```typescript
import './components/proposals/proposal-list';

<proposal-list
  .proposals=${proposals}
  .userRole=${userRole}
  @proposal-approved=${this.handleProposalApproved}
  @proposal-executed=${this.handleProposalExecuted}
></proposal-list>
```

### Compliance Monitoring

#### ComplianceChecker
```typescript
import './components/compliance/compliance-checker';

<compliance-checker
  .proposalId=${proposalId}
  .recipientAddress=${recipientAddress}
  @compliance-completed=${this.handleComplianceCompleted}
></compliance-checker>
```

#### AuditTrail
```typescript
import './components/compliance/audit-trail';

<audit-trail
  .treasuryId=${treasuryId}
  .dateRange=${dateRange}
  .filters=${filters}
></audit-trail>
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# Sui Network Configuration
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
VITE_PACKAGE_ID=0x...

# dWallet Configuration
VITE_DWALLET_NETWORK_URL=https://rpc.testnet.dwallet.io
VITE_DWALLET_PACKAGE_ID=0x...

# Application Configuration
VITE_APP_NAME="BitcoinVault Pro"
VITE_APP_VERSION="1.0.0"
VITE_ENVIRONMENT=development

# API Endpoints
VITE_BITCOIN_API_URL=https://api.bitcoin.com
VITE_COMPLIANCE_API_URL=https://api.compliance-provider.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_COMPLIANCE=true
VITE_ENABLE_EMERGENCY_MODE=true
```

### Sui Client Configuration

```typescript
// src/config/sui.ts
import { SuiClient } from '@mysten/sui/client';

export const suiClient = new SuiClient({
  url: import.meta.env.VITE_SUI_RPC_URL,
});

export const packageId = import.meta.env.VITE_PACKAGE_ID;
```

### dWallet Configuration

```typescript
// src/config/dwallet.ts
import { DWalletClient } from '@dwallet-network/sdk';

export const dwalletClient = new DWalletClient({
  networkUrl: import.meta.env.VITE_DWALLET_NETWORK_URL,
  packageId: import.meta.env.VITE_DWALLET_PACKAGE_ID,
});
```

## 🎨 Styling & Theming

### CSS Custom Properties

```css
/* src/styles/global.css */
:root {
  /* Colors */
  --primary-color: #1a73e8;
  --secondary-color: #34a853;
  --error-color: #ea4335;
  --warning-color: #fbbc04;
  --success-color: #34a853;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Borders */
  --border-radius: 0.375rem;
  --border-width: 1px;
  --border-color: #e5e7eb;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Component Styling

```typescript
// Example component with styling
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('treasury-card')
export class TreasuryCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-md);
      padding: var(--spacing-lg);
      margin: var(--spacing-md);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }
    
    .title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .balance {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--primary-color);
    }
  `;

  @property({ type: String }) treasuryName = '';
  @property({ type: Number }) balance = 0;

  render() {
    return html`
      <div class="header">
        <h3 class="title">${this.treasuryName}</h3>
        <div class="balance">${this.formatBTC(this.balance)} BTC</div>
      </div>
      <slot></slot>
    `;
  }

  private formatBTC(satoshis: number): string {
    return (satoshis / 100000000).toFixed(8);
  }
}
```

## 🔄 State Management

### Treasury Store

```typescript
// src/stores/treasury.ts
import { atom, map } from 'nanostores';
import type { TreasuryVault, ExpenditureProposal } from '../types/treasury';

export const $treasuries = map<Record<string, TreasuryVault>>({});
export const $selectedTreasury = atom<string | null>(null);
export const $proposals = map<Record<string, ExpenditureProposal>>({});
export const $isLoading = atom<boolean>(false);

export const treasuryActions = {
  setTreasuries(treasuries: TreasuryVault[]) {
    const treasuryMap = treasuries.reduce((acc, treasury) => {
      acc[treasury.id] = treasury;
      return acc;
    }, {} as Record<string, TreasuryVault>);
    $treasuries.set(treasuryMap);
  },

  selectTreasury(treasuryId: string) {
    $selectedTreasury.set(treasuryId);
  },

  addProposal(proposal: ExpenditureProposal) {
    $proposals.setKey(proposal.id, proposal);
  },

  updateProposal(proposalId: string, updates: Partial<ExpenditureProposal>) {
    const current = $proposals.get()[proposalId];
    if (current) {
      $proposals.setKey(proposalId, { ...current, ...updates });
    }
  }
};
```

### Using Stores in Components

```typescript
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StoreController } from '@nanostores/lit';
import { $treasuries, $selectedTreasury } from '../stores/treasury';

@customElement('treasury-selector')
export class TreasurySelector extends LitElement {
  private treasuries = new StoreController(this, $treasuries);
  private selectedTreasury = new StoreController(this, $selectedTreasury);

  render() {
    const treasuries = Object.values(this.treasuries.value);
    const selected = this.selectedTreasury.value;

    return html`
      <select @change=${this.handleTreasuryChange}>
        <option value="">Select Treasury</option>
        ${treasuries.map(treasury => html`
          <option 
            value=${treasury.id} 
            ?selected=${treasury.id === selected}
          >
            ${treasury.name}
          </option>
        `)}
      </select>
    `;
  }

  private handleTreasuryChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    treasuryActions.selectTreasury(select.value);
  }
}
```

## 🧪 Testing

### Component Testing

```typescript
// src/components/__tests__/treasury-card.test.ts
import { expect, fixture, html } from '@open-wc/testing';
import '../treasury/treasury-card';
import type { TreasuryCard } from '../treasury/treasury-card';

describe('TreasuryCard', () => {
  it('displays treasury name and balance', async () => {
    const el: TreasuryCard = await fixture(html`
      <treasury-card 
        treasuryName="Test Treasury" 
        .balance=${100000000}
      ></treasury-card>
    `);

    expect(el.shadowRoot?.textContent).to.include('Test Treasury');
    expect(el.shadowRoot?.textContent).to.include('1.00000000 BTC');
  });

  it('formats balance correctly', async () => {
    const el: TreasuryCard = await fixture(html`
      <treasury-card .balance=${50000000}></treasury-card>
    `);

    expect(el.shadowRoot?.textContent).to.include('0.50000000 BTC');
  });
});
```

### Service Testing

```typescript
// src/services/__tests__/treasury.test.ts
import { expect } from '@esm-bundle/chai';
import { TreasuryService } from '../treasury';
import { mockSuiClient } from '../__mocks__/sui-client';

describe('TreasuryService', () => {
  let service: TreasuryService;

  beforeEach(() => {
    service = new TreasuryService(mockSuiClient);
  });

  it('creates treasury vault', async () => {
    const vault = await service.createTreasuryVault({
      name: 'Test Treasury',
      description: 'Test Description',
      organization: 'Test Org',
      requiredSigners: ['0x123'],
      minApprovalThreshold: 1
    });

    expect(vault).to.have.property('id');
    expect(vault.name).to.equal('Test Treasury');
  });
});
```

## 📚 Storybook

### Component Stories

```typescript
// stories/treasury/TreasuryCard.stories.ts
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../src/components/treasury/treasury-card';

const meta: Meta = {
  title: 'Treasury/TreasuryCard',
  component: 'treasury-card',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    treasuryName: { control: 'text' },
    balance: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    treasuryName: 'Enterprise Treasury',
    balance: 100000000, // 1 BTC
  },
  render: (args) => html`
    <treasury-card 
      treasuryName=${args.treasuryName} 
      .balance=${args.balance}
    >
      <p>Treasury content goes here</p>
    </treasury-card>
  `,
};

export const LargeBalance: Story = {
  args: {
    treasuryName: 'Main Treasury',
    balance: 1000000000, // 10 BTC
  },
  render: (args) => html`
    <treasury-card 
      treasuryName=${args.treasuryName} 
      .balance=${args.balance}
    ></treasury-card>
  `,
};
```

## 🚀 Build & Deployment

### Development

```bash
# Start development server
pnpm dev

# Start with specific port
pnpm dev --port 3000

# Start Storybook
pnpm storybook
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Build Storybook
pnpm build-storybook
```

### Deployment

```bash
# Deploy to staging
pnpm deploy:staging

# Deploy to production
pnpm deploy:production

# Deploy Storybook
pnpm deploy:storybook
```

## 🔧 Available Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "web-test-runner --coverage",
    "test:watch": "web-test-runner --watch",
    "lint": "eslint src --ext ts,tsx",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx,css}",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "type-check": "tsc --noEmit"
  }
}
```

## 🤝 Contributing

1. Follow the component development guidelines
2. Write comprehensive tests for new components
3. Document components with Storybook stories
4. Use TypeScript for type safety
5. Follow the established coding standards

## 📖 Documentation

- [Component API Documentation](./docs/components.md)
- [Service Documentation](./docs/services.md)
- [State Management Guide](./docs/state-management.md)
- [Styling Guide](./docs/styling.md)

---

**Frontend built with modern web technologies for enterprise Bitcoin treasury management.**
