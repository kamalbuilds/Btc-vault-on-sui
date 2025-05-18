import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'

// Package ID for our BitcoinVault Pro smart contracts
export const PACKAGE_ID = '0x6dbe0b8c4a3f4b2e1d7c9a8b5f3e2d1c0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4'

// Module names
export const MODULES = {
  ENTERPRISE_TREASURY: 'enterprise_treasury',
  BITCOIN_OPERATIONS: 'bitcoin_operations',
  COMPLIANCE_ENGINE: 'compliance_engine',
}

// Function names
export const FUNCTIONS = {
  CREATE_TREASURY_VAULT: 'create_treasury_vault',
  UPDATE_SPENDING_POLICY: 'update_spending_policy',
  SUBMIT_TRANSACTION: 'submit_transaction',
  APPROVE_TRANSACTION: 'approve_transaction',
  GET_VAULT_INFO: 'get_vault_info',
  GET_TRANSACTION_STATUS: 'get_transaction_status',
}

export interface TreasuryVaultData {
  id: string
  name: string
  description: string
  bitcoin_address: string
  balance: string
  daily_limit: string
  monthly_limit: string
  single_transaction_limit: string
  approval_threshold: number
  authorized_signers: string[]
  created_at: string
  last_activity: string
  status: string
}

export interface TransactionData {
  id: string
  vault_id: string
  transaction_type: string
  amount: string
  recipient: string
  sender: string
  status: string
  risk_score: number
  compliance_status: string
  created_at: string
  approvals: string[]
  required_approvals: number
  tx_hash?: string
  fee?: string
}

export class SuiTreasuryService {
  private client: SuiClient

  constructor(client: SuiClient) {
    this.client = client
  }

  /**
   * Create a new treasury vault
   */
  async createTreasuryVault(
    name: string,
    description: string,
    dailyLimit: bigint,
    monthlyLimit: bigint,
    singleTransactionLimit: bigint,
    approvalThreshold: number,
    authorizedSigners: string[]
  ): Promise<Transaction> {
    const tx = new Transaction()
    
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULES.ENTERPRISE_TREASURY}::${FUNCTIONS.CREATE_TREASURY_VAULT}`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.u64(dailyLimit),
        tx.pure.u64(monthlyLimit),
        tx.pure.u64(singleTransactionLimit),
        tx.pure.u8(approvalThreshold),
        tx.pure.vector('address', authorizedSigners),
      ],
    })

    return tx
  }

  /**
   * Get treasury vault information
   */
  async getTreasuryVault(vaultId: string): Promise<TreasuryVaultData | null> {
    try {
      const object = await this.client.getObject({
        id: vaultId,
        options: {
          showContent: true,
          showType: true,
        },
      })

      if (!object.data?.content || object.data.content.dataType !== 'moveObject') {
        return null
      }

      const fields = object.data.content.fields as any
      
      return {
        id: vaultId,
        name: fields.name,
        description: fields.description,
        bitcoin_address: fields.bitcoin_address,
        balance: fields.balance,
        daily_limit: fields.daily_limit,
        monthly_limit: fields.monthly_limit,
        single_transaction_limit: fields.single_transaction_limit,
        approval_threshold: fields.approval_threshold,
        authorized_signers: fields.authorized_signers,
        created_at: fields.created_at,
        last_activity: fields.last_activity,
        status: fields.status,
      }
    } catch (error) {
      console.error('Error fetching treasury vault:', error)
      return null
    }
  }

  /**
   * Get all treasury vaults owned by an address
   */
  async getTreasuryVaults(ownerAddress: string): Promise<TreasuryVaultData[]> {
    try {
      const objects = await this.client.getOwnedObjects({
        owner: ownerAddress,
        filter: {
          StructType: `${PACKAGE_ID}::${MODULES.ENTERPRISE_TREASURY}::TreasuryVault`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      })

      const vaults: TreasuryVaultData[] = []
      
      for (const obj of objects.data) {
        if (obj.data?.content && obj.data.content.dataType === 'moveObject') {
          const fields = obj.data.content.fields as any
          vaults.push({
            id: obj.data.objectId,
            name: fields.name,
            description: fields.description,
            bitcoin_address: fields.bitcoin_address,
            balance: fields.balance,
            daily_limit: fields.daily_limit,
            monthly_limit: fields.monthly_limit,
            single_transaction_limit: fields.single_transaction_limit,
            approval_threshold: fields.approval_threshold,
            authorized_signers: fields.authorized_signers,
            created_at: fields.created_at,
            last_activity: fields.last_activity,
            status: fields.status,
          })
        }
      }

      return vaults
    } catch (error) {
      console.error('Error fetching treasury vaults:', error)
      return []
    }
  }

  /**
   * Submit a Bitcoin transaction for approval
   */
  async submitTransaction(
    vaultId: string,
    recipient: string,
    amount: bigint,
    transactionType: string
  ): Promise<Transaction> {
    const tx = new Transaction()
    
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULES.BITCOIN_OPERATIONS}::${FUNCTIONS.SUBMIT_TRANSACTION}`,
      arguments: [
        tx.object(vaultId),
        tx.pure.string(recipient),
        tx.pure.u64(amount),
        tx.pure.string(transactionType),
      ],
    })

    return tx
  }

  /**
   * Approve a pending transaction
   */
  async approveTransaction(
    vaultId: string,
    transactionId: string
  ): Promise<Transaction> {
    const tx = new Transaction()
    
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULES.ENTERPRISE_TREASURY}::${FUNCTIONS.APPROVE_TRANSACTION}`,
      arguments: [
        tx.object(vaultId),
        tx.pure.string(transactionId),
      ],
    })

    return tx
  }

  /**
   * Get transaction status and details
   */
  async getTransactionStatus(transactionId: string): Promise<TransactionData | null> {
    try {
      const object = await this.client.getObject({
        id: transactionId,
        options: {
          showContent: true,
          showType: true,
        },
      })

      if (!object.data?.content || object.data.content.dataType !== 'moveObject') {
        return null
      }

      const fields = object.data.content.fields as any
      
      return {
        id: transactionId,
        vault_id: fields.vault_id,
        transaction_type: fields.transaction_type,
        amount: fields.amount,
        recipient: fields.recipient,
        sender: fields.sender,
        status: fields.status,
        risk_score: fields.risk_score,
        compliance_status: fields.compliance_status,
        created_at: fields.created_at,
        approvals: fields.approvals,
        required_approvals: fields.required_approvals,
        tx_hash: fields.tx_hash,
        fee: fields.fee,
      }
    } catch (error) {
      console.error('Error fetching transaction status:', error)
      return null
    }
  }

  /**
   * Get all transactions for a vault
   */
  async getVaultTransactions(vaultId: string): Promise<TransactionData[]> {
    try {
      // Query for transaction objects related to this vault
      const events = await this.client.queryEvents({
        query: {
          MoveEventType: `${PACKAGE_ID}::${MODULES.BITCOIN_OPERATIONS}::TransactionSubmitted`,
        },
        limit: 50,
        order: 'descending',
      })

      const transactions: TransactionData[] = []
      
      for (const event of events.data) {
        const parsedJson = event.parsedJson as any
        if (parsedJson.vault_id === vaultId) {
          transactions.push({
            id: parsedJson.transaction_id,
            vault_id: parsedJson.vault_id,
            transaction_type: parsedJson.transaction_type,
            amount: parsedJson.amount,
            recipient: parsedJson.recipient,
            sender: parsedJson.sender,
            status: parsedJson.status,
            risk_score: parsedJson.risk_score,
            compliance_status: parsedJson.compliance_status,
            created_at: parsedJson.created_at,
            approvals: parsedJson.approvals || [],
            required_approvals: parsedJson.required_approvals,
            tx_hash: parsedJson.tx_hash,
            fee: parsedJson.fee,
          })
        }
      }

      return transactions
    } catch (error) {
      console.error('Error fetching vault transactions:', error)
      return []
    }
  }

  /**
   * Get current Bitcoin price (mock implementation)
   * In production, this would integrate with a real price feed
   */
  async getBitcoinPrice(): Promise<number> {
    try {
      // This is a mock implementation
      // In production, you would integrate with a real price oracle or API
      return 45000 + Math.random() * 1000 // Mock price between 45k-46k
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error)
      return 45000 // Fallback price
    }
  }

  /**
   * Validate Bitcoin address format
   */
  validateBitcoinAddress(address: string): boolean {
    // Basic Bitcoin address validation
    const patterns = [
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Legacy P2PKH and P2SH
      /^bc1[a-z0-9]{39,59}$/, // Bech32 P2WPKH and P2WSH
      /^bc1p[a-z0-9]{58}$/, // Bech32m P2TR
    ]
    
    return patterns.some(pattern => pattern.test(address))
  }

  /**
   * Format amount from satoshis to BTC
   */
  formatBTC(satoshis: string | bigint): string {
    const sats = typeof satoshis === 'string' ? BigInt(satoshis) : satoshis
    const btc = Number(sats) / 100000000
    return btc.toFixed(8) + ' BTC'
  }

  /**
   * Parse BTC amount to satoshis
   */
  parseBTCToSatoshis(btcAmount: string): bigint {
    const btc = parseFloat(btcAmount)
    return BigInt(Math.round(btc * 100000000))
  }
} 