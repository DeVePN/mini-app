// Wallet and Payment Types

export type TransactionType = 'deposit' | 'payment' | 'refund' | 'withdrawal' | 'channel_open' | 'channel_close' | 'stake' | 'unstake' | 'earning';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';
export type PaymentChannelStatus = 'opening' | 'open' | 'active' | 'closing' | 'closed';

export interface WalletBalance {
  ton: number;
  usd: number;
  locked: number; // TON locked in payment channels
  available: number; // TON available for use
  lastUpdated: string;
}

export interface PaymentChannel {
  id: string;
  contractAddress: string;
  status: PaymentChannelStatus;
  nodeId: string;
  nodeName: string;
  nodeLocation: {
    country: string;
    city: string;
  };
  lockedAmount: number; // TON
  usedAmount: number; // TON
  remainingAmount: number; // TON
  estimatedTimeRemaining?: number; // seconds
  createdAt: string;
  lastActivityAt: string;
  closedAt?: string;
  sessionId?: string;
}

export interface Transaction {
  id: string;
  hash: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  amount: number; // TON (positive for incoming, negative for outgoing)
  fee?: number; // TON
  from?: string;
  to?: string;
  timestamp: string;
  blockNumber?: number;
  confirmations?: number;
  metadata?: {
    sessionId?: string;
    channelId?: string;
    nodeId?: string;
  };
}

export interface WalletInfo {
  address: string;
  network: 'testnet' | 'mainnet';
  balance: WalletBalance;
  isConnected: boolean;
  connectedAt?: string;
}

export interface TopUpOptions {
  amounts: number[]; // Suggested amounts in TON
  minimum: number;
  maximum: number;
}

export interface PaymentChannelSettings {
  autoCloseInactive: boolean;
  inactivityThreshold: number; // hours
  autoCloseWhenLow: boolean;
  lowBalanceThreshold: number; // TON
  closeOnSessionEnd: boolean;
}

export interface TransactionFilters {
  type?: TransactionType[];
  status?: TransactionStatus[];
  dateRange?: {
    from: string;
    to: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface WalletStatistics {
  totalDeposited: number; // TON
  totalSpent: number; // TON
  totalEarned?: number; // TON (for providers)
  totalRefunded: number; // TON
  totalFees: number; // TON
  averageTransactionAmount: number;
  transactionCount: number;
}
