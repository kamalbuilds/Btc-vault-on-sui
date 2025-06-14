// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 
// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
	localnet: { url: getFullnodeUrl('localnet') },
	testnet: { url: getFullnodeUrl('testnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
});

const queryClient = new QueryClient();

import App from './App.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
				<WalletProvider>
					<App />
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	</StrictMode>,
);
