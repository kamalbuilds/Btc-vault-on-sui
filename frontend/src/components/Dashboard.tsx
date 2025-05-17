import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useTreasuryStore } from '../store/treasury'
import { formatBTC, formatUSD, formatDate, calculateRiskLevel } from '../lib/utils'
import { 
  Bitcoin, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Clock,
  Plus,
  Eye,
  Settings
} from 'lucide-react'

const Dashboard: React.FC = () => {
  const {
    vaults,
    transactions,
    getTotalBalance,
    getPendingTransactions,
    isLoading,
    error
  } = useTreasuryStore()

  const [btcPrice, setBtcPrice] = useState(45000) // Mock BTC price

  const totalBalance = getTotalBalance()
  const pendingTransactions = getPendingTransactions()
  const totalUSDValue = totalBalance * btcPrice / 100000000 // Convert satoshis to BTC then to USD

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch data from the blockchain
    const mockVaults = [
      {
        id: '1',
        name: 'Main Treasury',
        description: 'Primary corporate Bitcoin holdings',
        bitcoinAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        balance: 500000000, // 5 BTC in satoshis
        dailyLimit: 100000000,
        monthlyLimit: 1000000000,
        singleTransactionLimit: 50000000,
        approvalThreshold: 2,
        authorizedSigners: ['0x123...', '0x456...', '0x789...'],
        createdAt: new Date('2024-01-15'),
        lastActivity: new Date(),
        status: 'active' as const
      },
      {
        id: '2',
        name: 'Emergency Fund',
        description: 'Reserved funds for emergency situations',
        bitcoinAddress: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
        balance: 200000000, // 2 BTC in satoshis
        dailyLimit: 50000000,
        monthlyLimit: 500000000,
        singleTransactionLimit: 25000000,
        approvalThreshold: 3,
        authorizedSigners: ['0x123...', '0x456...'],
        createdAt: new Date('2024-01-20'),
        lastActivity: new Date(Date.now() - 86400000), // 1 day ago
        status: 'active' as const
      }
    ]

    const mockTransactions = [
      {
        id: 'tx1',
        vaultId: '1',
        type: 'send' as const,
        amount: 10000000, // 0.1 BTC
        recipient: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        sender: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        status: 'pending' as const,
        riskScore: 25,
        complianceStatus: 'approved' as const,
        createdAt: new Date(),
        approvals: ['0x123...'],
        requiredApprovals: 2,
        fee: 5000
      },
      {
        id: 'tx2',
        vaultId: '1',
        type: 'receive' as const,
        amount: 50000000, // 0.5 BTC
        recipient: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        sender: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
        status: 'completed' as const,
        riskScore: 10,
        complianceStatus: 'approved' as const,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        approvals: [],
        requiredApprovals: 0,
        txHash: '1a2b3c4d5e6f...'
      }
    ]

    // Simulate loading
    setTimeout(() => {
      useTreasuryStore.getState().setVaults(mockVaults)
      useTreasuryStore.getState().setTransactions(mockTransactions)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bitcoin-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">BitcoinVault Pro</h1>
            <p className="text-gray-600">Enterprise Bitcoin Treasury Management</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="bitcoin" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Vault
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <Bitcoin className="h-4 w-4 text-bitcoin-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBTC(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                {formatUSD(totalUSDValue)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vaults</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vaults.length}</div>
              <p className="text-xs text-muted-foreground">
                {vaults.filter(v => v.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTransactions.length}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Low</div>
              <p className="text-xs text-muted-foreground">
                All systems secure
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vaults List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Treasury Vaults</CardTitle>
                <CardDescription>
                  Manage your Bitcoin treasury vaults and their configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vaults.map((vault) => (
                    <div
                      key={vault.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-bitcoin-100 rounded-full flex items-center justify-center">
                          <Bitcoin className="w-5 h-5 text-bitcoin-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{vault.name}</h3>
                          <p className="text-sm text-gray-500">{vault.description}</p>
                          <p className="text-xs text-gray-400">
                            Last activity: {formatDate(vault.lastActivity)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatBTC(vault.balance)}</p>
                        <p className="text-sm text-gray-500">
                          {formatUSD(vault.balance * btcPrice / 100000000)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            vault.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {vault.status}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Latest treasury activities and pending approvals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((tx) => {
                    const risk = calculateRiskLevel(tx.riskScore)
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.type === 'send' ? 'bg-red-100' : 'bg-green-100'
                          }`}>
                            <TrendingUp className={`w-4 h-4 ${
                              tx.type === 'send' ? 'text-red-600 rotate-180' : 'text-green-600'
                            }`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {tx.type === 'send' ? 'Sent' : 'Received'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(tx.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {tx.type === 'send' ? '-' : '+'}{formatBTC(tx.amount)}
                          </p>
                          <div className="flex items-center space-x-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              tx.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : tx.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {tx.status}
                            </span>
                            <span className={`text-xs ${risk.color}`}>
                              {risk.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 