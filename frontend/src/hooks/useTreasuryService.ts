import { useMemo } from 'react'
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { SuiTreasuryService, TreasuryVaultData, TransactionData } from '../lib/sui-integration'
import { Transaction } from '@mysten/sui/transactions'

export function useTreasuryService() {
  const client = useSuiClient()
  const currentAccount = useCurrentAccount()
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()

  const treasuryService = useMemo(() => {
    return new SuiTreasuryService(client)
  }, [client])

  const executeTransaction = async (transaction: Transaction) => {
    if (!currentAccount) {
      throw new Error('No wallet connected')
    }

    try {
      const result = await signAndExecuteTransaction({
        transaction,
      })

      return result
    } catch (error) {
      console.error('Transaction execution failed:', error)
      throw error
    }
  }

  const createVault = async (
    name: string,
    description: string,
    dailyLimit: bigint,
    monthlyLimit: bigint,
    singleTransactionLimit: bigint,
    approvalThreshold: number,
    authorizedSigners: string[]
  ) => {
    const transaction = await treasuryService.createTreasuryVault(
      name,
      description,
      dailyLimit,
      monthlyLimit,
      singleTransactionLimit,
      approvalThreshold,
      authorizedSigners
    )

    return executeTransaction(transaction)
  }

  const submitTransaction = async (
    vaultId: string,
    recipient: string,
    amount: bigint,
    transactionType: string
  ) => {
    const transaction = await treasuryService.submitTransaction(
      vaultId,
      recipient,
      amount,
      transactionType
    )

    return executeTransaction(transaction)
  }

  const approveTransaction = async (vaultId: string, transactionId: string) => {
    const transaction = await treasuryService.approveTransaction(vaultId, transactionId)
    return executeTransaction(transaction)
  }

  const getUserVaults = async (): Promise<TreasuryVaultData[]> => {
    if (!currentAccount?.address) {
      return []
    }

    return treasuryService.getTreasuryVaults(currentAccount.address)
  }

  const getVaultTransactions = async (vaultId: string): Promise<TransactionData[]> => {
    return treasuryService.getVaultTransactions(vaultId)
  }

  const getVaultInfo = async (vaultId: string): Promise<TreasuryVaultData | null> => {
    return treasuryService.getTreasuryVault(vaultId)
  }

  const getBitcoinPrice = async (): Promise<number> => {
    return treasuryService.getBitcoinPrice()
  }

  const validateBitcoinAddress = (address: string): boolean => {
    return treasuryService.validateBitcoinAddress(address)
  }

  const formatBTC = (satoshis: string | bigint): string => {
    return treasuryService.formatBTC(satoshis)
  }

  const parseBTCToSatoshis = (btcAmount: string): bigint => {
    return treasuryService.parseBTCToSatoshis(btcAmount)
  }

  return {
    // Service instance
    treasuryService,
    
    // Account info
    currentAccount,
    isConnected: !!currentAccount,
    
    // Transaction methods
    createVault,
    submitTransaction,
    approveTransaction,
    
    // Query methods
    getUserVaults,
    getVaultTransactions,
    getVaultInfo,
    getBitcoinPrice,
    
    // Utility methods
    validateBitcoinAddress,
    formatBTC,
    parseBTCToSatoshis,
  }
} 