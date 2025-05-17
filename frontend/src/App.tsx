// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react'
import Dashboard from './components/Dashboard'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Bitcoin, Wallet, Shield } from 'lucide-react';
import { ConnectButton } from '@mysten/dapp-kit';
import '@mysten/dapp-kit/dist/index.css';

function App() {
	const [isConnected, setIsConnected] = useState(false)

	const connectWallet = () => {
		// Simulate wallet connection
		setIsConnected(true)
	}

	const disconnectWallet = () => {
		setIsConnected(false)
	}

	// If wallet is connected, show the dashboard
	if (isConnected) {
		return <Dashboard />
	}

	// Landing page for wallet connection
	return (
		<div className="min-h-screen bg-gradient-to-br from-bitcoin-50 to-orange-100 flex items-center justify-center p-6">
			<div className="max-w-4xl mx-auto text-center space-y-8">
				{/* Hero Section */}
				<div className="space-y-4">
					<div className="flex justify-center">
						<div className="w-20 h-20 bg-bitcoin-500 rounded-full flex items-center justify-center">
							<Bitcoin className="w-10 h-10 text-white" />
						</div>
					</div>
					<h1 className="text-5xl font-bold text-gray-900">
						BitcoinVault Pro
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Enterprise Bitcoin Treasury Management Platform powered by Sui & dWallet Network
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
					<Card>
						<CardHeader>
							<Shield className="w-8 h-8 text-bitcoin-500 mx-auto" />
							<CardTitle className="text-lg">Secure Custody</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								Multi-signature security with dWallet Network's programmable custody
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Bitcoin className="w-8 h-8 text-bitcoin-500 mx-auto" />
							<CardTitle className="text-lg">Treasury Management</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								Automated spending policies, compliance checks, and risk management
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Wallet className="w-8 h-8 text-bitcoin-500 mx-auto" />
							<CardTitle className="text-lg">Enterprise Ready</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription>
								Built for institutions with advanced analytics and reporting
							</CardDescription>
						</CardContent>
					</Card>
				</div>

				{/* Wallet Connection */}
				<Card className="max-w-md mx-auto">
					<CardHeader>
						<CardTitle>Connect Your Wallet</CardTitle>
						<CardDescription>
							Connect your Sui wallet to access BitcoinVault Pro
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
								<ConnectButton className='w-full' />
							<p className="text-xs text-gray-500">
								Demo mode - Click to explore the interface
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="text-center text-gray-500 text-sm">
					<p>Powered by Sui Blockchain & dWallet Network</p>
					<p className="mt-2">
						Package ID: <code className="bg-gray-200 px-2 py-1 rounded text-xs">
							0x6dbe0b8c4a3f4b2e1d7c9a8b5f3e2d1c0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4
						</code>
					</p>
				</div>
			</div>
		</div>
	)
}

export default App
