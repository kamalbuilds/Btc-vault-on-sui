import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useTreasuryService } from '../hooks/useTreasuryService'
import { formatBTC, formatUSD, formatDate, calculateRiskLevel } from '../lib/utils'
import { 
  Bitcoin, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  Plus,
  Eye,
  Settings,
  Wallet,
  RefreshCw
} from 'lucide-react'

const Dashboard: React.FC = () => {
  const {
    currentAccount,
    isConnected,
    getUserVaults,
    getVaultTransactions,
    getBitcoinPrice,
  } = useTreasuryService()

  const [vaults, setVaults] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [btcPrice, setBtcPrice] = useState(45000)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from blockchain
  const loadData = async () => {
    if (!isConnected) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Fetch Bitcoin price
      const price = await getBitcoinPrice()
      setBtcPrice(price)

      // Fetch user's treasury vaults
      const userVaults = await getUserVaults()
      
      // Convert blockchain data to display format
      const formattedVaults = userVaults.map(vault => ({
        id: vault.id,
        name: vault.name,
        description: vault.description,
        bitcoinAddress: vault.bitcoin_address,
        balance: parseInt(vault.balance),
        dailyLimit: parseInt(vault.daily_limit),
        monthlyLimit: parseInt(vault.monthly_limit),
        singleTransactionLimit: parseInt(vault.single_transaction_limit),
        approvalThreshold: vault.approval_threshold,
        authorizedSigners: vault.authorized_signers,
        createdAt: new Date(parseInt(vault.created_at)),
        lastActivity: new Date(parseInt(vault.last_activity)),
        status: vault.status as 'active' | 'frozen' | 'suspended'
      }))

      setVaults(formattedVaults)

      // Fetch transactions for all vaults
      const allTransactions = []
      for (const vault of userVaults) {
        const vaultTxs = await getVaultTransactions(vault.id)
        const formattedTxs = vaultTxs.map(tx => ({
          id: tx.id,
          vaultId: tx.vault_id,
          type: tx.transaction_type as 'send' | 'receive',
          amount: parseInt(tx.amount),
          recipient: tx.recipient,
          sender: tx.sender,
          status: tx.status as 'pending' | 'approved' | 'rejected' | 'completed' | 'failed',
          riskScore: tx.risk_score,
          complianceStatus: tx.compliance_status as 'pending' | 'approved' | 'flagged' | 'rejected',
          createdAt: new Date(parseInt(tx.created_at)),
          approvals: tx.approvals,
          requiredApprovals: tx.required_approvals,
          txHash: tx.tx_hash,
          fee: tx.fee ? parseInt(tx.fee) : undefined
        }))
        allTransactions.push(...formattedTxs)
      }

      setTransactions(allTransactions)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load treasury data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [isConnected, currentAccount])

  const totalBalance = vaults.reduce((total, vault) => total + vault.balance, 0)
  const pendingTransactions = transactions.filter(tx => tx.status === 'pending')
  const totalUSDValue = totalBalance * btcPrice / 100000000

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="w-96">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Wallet className="w-12 h-12 text-bitcoin-500" />
            </div>
            <CardTitle className="text-center">Wallet Not Connected</CardTitle>
            <CardDescription className="text-center">
              Please connect your Sui wallet to access the treasury dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 text-center">
              Use the wallet connection button to get started
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bitcoin-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading treasury data from blockchain...</p>
        </div>
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
            <p className="mb-4">{error}</p>
            <Button onClick={loadData} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
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
            <p className="text-sm text-gray-500">
              Connected: {currentAccount?.address ? 
                `${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}` : 
                'Unknown'
              }
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
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
                {vaults.length === 0 ? (
                  <div className="text-center py-8">
                    <Bitcoin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Treasury Vaults</h3>
                    <p className="text-gray-500 mb-4">
                      Create your first treasury vault to get started with Bitcoin management
                    </p>
                    <Button variant="bitcoin">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Vault
                    </Button>
                  </div>
                ) : (
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
                )}
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
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No transactions yet</p>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 