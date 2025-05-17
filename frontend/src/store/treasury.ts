import { create } from 'zustand'

export interface TreasuryVault {
  id: string
  name: string
  description: string
  bitcoinAddress: string
  balance: number
  dailyLimit: number
  monthlyLimit: number
  singleTransactionLimit: number
  approvalThreshold: number
  authorizedSigners: string[]
  createdAt: Date
  lastActivity: Date
  status: 'active' | 'frozen' | 'suspended'
}

export interface Transaction {
  id: string
  vaultId: string
  type: 'send' | 'receive'
  amount: number
  recipient: string
  sender: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'failed'
  riskScore: number
  complianceStatus: 'pending' | 'approved' | 'flagged' | 'rejected'
  createdAt: Date
  approvals: string[]
  requiredApprovals: number
  txHash?: string
  fee?: number
}

export interface ComplianceRecord {
  id: string
  userId: string
  verificationType: 'kyc' | 'aml' | 'sanctions'
  status: 'pending' | 'approved' | 'rejected'
  riskScore: number
  verifiedAt?: Date
  expiresAt?: Date
  jurisdiction: string
}

interface TreasuryStore {
  // State
  vaults: TreasuryVault[]
  transactions: Transaction[]
  complianceRecords: ComplianceRecord[]
  selectedVault: TreasuryVault | null
  isLoading: boolean
  error: string | null

  // Actions
  setVaults: (vaults: TreasuryVault[]) => void
  addVault: (vault: TreasuryVault) => void
  updateVault: (id: string, updates: Partial<TreasuryVault>) => void
  setSelectedVault: (vault: TreasuryVault | null) => void
  
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  
  setComplianceRecords: (records: ComplianceRecord[]) => void
  addComplianceRecord: (record: ComplianceRecord) => void
  
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed
  getVaultById: (id: string) => TreasuryVault | undefined
  getTransactionsByVault: (vaultId: string) => Transaction[]
  getPendingTransactions: () => Transaction[]
  getTotalBalance: () => number
}

export const useTreasuryStore = create<TreasuryStore>((set, get) => ({
  // Initial state
  vaults: [],
  transactions: [],
  complianceRecords: [],
  selectedVault: null,
  isLoading: false,
  error: null,

  // Actions
  setVaults: (vaults) => set({ vaults }),
  addVault: (vault) => set((state) => ({ vaults: [...state.vaults, vault] })),
  updateVault: (id, updates) =>
    set((state) => ({
      vaults: state.vaults.map((vault) =>
        vault.id === id ? { ...vault, ...updates } : vault
      ),
    })),
  setSelectedVault: (vault) => set({ selectedVault: vault }),

  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      ),
    })),

  setComplianceRecords: (records) => set({ complianceRecords: records }),
  addComplianceRecord: (record) =>
    set((state) => ({ complianceRecords: [...state.complianceRecords, record] })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Computed
  getVaultById: (id) => get().vaults.find((vault) => vault.id === id),
  getTransactionsByVault: (vaultId) =>
    get().transactions.filter((tx) => tx.vaultId === vaultId),
  getPendingTransactions: () =>
    get().transactions.filter((tx) => tx.status === 'pending'),
  getTotalBalance: () =>
    get().vaults.reduce((total, vault) => total + vault.balance, 0),
})) 