import { WalletBalance, PaymentChannel, Transaction } from '@/types';

export const mockWalletBalance: WalletBalance = {
  wallet: 'EQD...userWallet1',
  balance: '25.48',
  usdValue: 127.40,
  lockedInChannels: '5.0',
  available: '20.48',
  lastUpdated: new Date().toISOString(),
};

export const mockPaymentChannels: PaymentChannel[] = [
  {
    id: 'channel-1',
    address: 'EQC...channel1',
    userWallet: 'EQD...userWallet1',
    nodeWallet: 'EQD...abc123',
    nodeId: 'node-1',
    nodeName: 'United States - New York',
    status: 'active',
    lockedAmount: '2.0',
    usedAmount: '0.05',
    remainingAmount: '1.95',
    createdAt: '2024-12-20T14:00:00Z',
    sessionId: 'session-1',
    autoClose: true,
  },
  {
    id: 'channel-2',
    address: 'EQC...channel2',
    userWallet: 'EQD...userWallet1',
    nodeWallet: 'EQD...def456',
    nodeId: 'node-2',
    nodeName: 'Germany - Frankfurt',
    status: 'closed',
    lockedAmount: '1.5',
    usedAmount: '0.0675',
    remainingAmount: '1.4325',
    createdAt: '2024-12-19T10:00:00Z',
    closedAt: '2024-12-19T12:15:00Z',
    sessionId: 'session-2',
    autoClose: true,
  },
  {
    id: 'channel-3',
    address: 'EQC...channel3',
    userWallet: 'EQD...userWallet1',
    nodeWallet: 'EQD...ghi789',
    nodeId: 'node-3',
    nodeName: 'Singapore - Singapore',
    status: 'closed',
    lockedAmount: '1.5',
    usedAmount: '0.13',
    remainingAmount: '1.37',
    createdAt: '2024-12-18T08:30:00Z',
    closedAt: '2024-12-18T11:45:00Z',
    sessionId: 'session-3',
    autoClose: false,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    hash: 'abc123def456...',
    wallet: 'EQD...userWallet1',
    type: 'deposit',
    amount: '10.0',
    fee: '0.01',
    status: 'confirmed',
    description: 'Wallet top-up',
    timestamp: '2024-12-20T10:00:00Z',
  },
  {
    id: 'tx-2',
    hash: 'def456ghi789...',
    wallet: 'EQD...userWallet1',
    type: 'channel_open',
    amount: '2.0',
    fee: '0.005',
    status: 'confirmed',
    description: 'Open payment channel - US Node',
    timestamp: '2024-12-20T14:00:00Z',
    relatedId: 'channel-1',
  },
  {
    id: 'tx-3',
    hash: 'ghi789jkl012...',
    wallet: 'EQD...userWallet1',
    type: 'payment',
    amount: '0.05',
    status: 'confirmed',
    description: 'VPN session payment',
    timestamp: '2024-12-20T15:00:00Z',
    relatedId: 'session-1',
  },
  {
    id: 'tx-4',
    hash: 'jkl012mno345...',
    wallet: 'EQD...userWallet1',
    type: 'channel_close',
    amount: '1.4325',
    fee: '0.003',
    status: 'confirmed',
    description: 'Close payment channel - refund',
    timestamp: '2024-12-19T12:15:00Z',
    relatedId: 'channel-2',
  },
  {
    id: 'tx-5',
    hash: 'mno345pqr678...',
    wallet: 'EQD...userWallet1',
    type: 'payment',
    amount: '0.0675',
    status: 'confirmed',
    description: 'VPN session payment',
    timestamp: '2024-12-19T12:15:00Z',
    relatedId: 'session-2',
  },
  {
    id: 'tx-6',
    hash: 'pqr678stu901...',
    wallet: 'EQD...userWallet1',
    type: 'deposit',
    amount: '15.0',
    fee: '0.01',
    status: 'confirmed',
    description: 'Wallet top-up',
    timestamp: '2024-12-15T09:00:00Z',
  },
  {
    id: 'tx-7',
    hash: 'stu901vwx234...',
    wallet: 'EQD...userWallet1',
    type: 'channel_open',
    amount: '1.5',
    fee: '0.005',
    status: 'confirmed',
    description: 'Open payment channel - Singapore Node',
    timestamp: '2024-12-18T08:30:00Z',
    relatedId: 'channel-3',
  },
  {
    id: 'tx-8',
    hash: 'vwx234yz567...',
    wallet: 'EQD...userWallet1',
    type: 'payment',
    amount: '0.13',
    status: 'confirmed',
    description: 'VPN session payment',
    timestamp: '2024-12-18T11:45:00Z',
    relatedId: 'session-3',
  },
];

export const getActiveChannels = (): PaymentChannel[] => {
  return mockPaymentChannels.filter(ch => ch.status === 'active' || ch.status === 'open');
};

export const getTransactionsByType = (type: Transaction['type']): Transaction[] => {
  return mockTransactions.filter(tx => tx.type === type);
};

export const getTotalSpent = (): number => {
  return mockTransactions
    .filter(tx => tx.type === 'payment' && tx.status === 'confirmed')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
};
