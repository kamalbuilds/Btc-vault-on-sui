import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBTC(satoshis: number): string {
  return (satoshis / 100000000).toFixed(8) + " BTC"
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date | string | number): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatAddress(address: string): string {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatTransactionId(txId: string): string {
  if (txId.length <= 16) return txId
  return `${txId.slice(0, 8)}...${txId.slice(-8)}`
}

export function calculateRiskLevel(score: number): {
  level: 'low' | 'medium' | 'high' | 'critical'
  color: string
  label: string
} {
  if (score <= 25) {
    return { level: 'low', color: 'text-green-600', label: 'Low Risk' }
  } else if (score <= 50) {
    return { level: 'medium', color: 'text-yellow-600', label: 'Medium Risk' }
  } else if (score <= 75) {
    return { level: 'high', color: 'text-orange-600', label: 'High Risk' }
  } else {
    return { level: 'critical', color: 'text-red-600', label: 'Critical Risk' }
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-100'
    case 'approved':
    case 'completed':
      return 'text-green-600 bg-green-100'
    case 'rejected':
    case 'failed':
      return 'text-red-600 bg-red-100'
    case 'flagged':
      return 'text-orange-600 bg-orange-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
} 