// User and Profile Types

/**
 * Basic user from backend (wallet auth)
 */
export interface BasicUserProfile {
  id: string;
  wallet_address: string;
  username?: string | null;
  telegram_id?: string | null;
  created_at: string;
  last_login?: string;
}

export type AccountType = 'consumer' | 'provider' | 'both';
export type ThemeMode = 'light' | 'dark' | 'auto';
export type DataUnit = 'MB-GB' | 'GB-TB';
export type SpeedUnit = 'Mbps' | 'MBps';
export type CurrencyDisplay = 'TON' | 'USD' | 'both';
export type NotificationType = 'session_status' | 'payment' | 'low_balance' | 'node_status' | 'earnings' | 'announcements';

export interface UserProfile {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  accountType: AccountType;
  walletAddress?: string;
  memberSince: string;
  reputationScore?: number; // for providers

  // Statistics
  statistics: {
    consumer?: {
      totalSessions: number;
      totalDuration: number; // seconds
      totalDataUsed: number; // GB
      totalSpent: number; // TON
      favoriteNode?: {
        id: string;
        name: string;
      };
      mostUsedCountry?: string;
    };
    provider?: {
      nodesOperated: number;
      totalEarned: number; // TON
      usersServed: number;
      averageRating: number;
    };
  };

  // Preferences
  preferences: UserPreferences;

  // Achievements
  achievements: Achievement[];

  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  // Connection
  connection: {
    autoConnect: boolean;
    autoReconnect: boolean;
    preferredMethod: 'qr' | 'file';
    killSwitch: boolean;
    splitTunneling: boolean;
  };

  // Payment
  payment: {
    defaultDuration: number; // hours
    autoRenewal: boolean;
    channelSettings: {
      autoCloseInactive: boolean;
      inactivityThreshold: number;
      autoCloseWhenLow: boolean;
      lowBalanceThreshold: number;
      closeOnSessionEnd: boolean;
    };
  };

  // Notifications
  notifications: {
    [key in NotificationType]: boolean;
  };

  // Display
  display: {
    theme: ThemeMode;
    language: string;
    dataUnits: DataUnit;
    speedUnits: SpeedUnit;
    currencyDisplay: CurrencyDisplay;
  };

  // Privacy
  privacy: {
    showActivityStatus: boolean;
    allowAnalytics: boolean;
    shareUsageStats: boolean;
  };

  // Advanced
  advanced: {
    network: 'testnet' | 'mainnet';
    customRPC?: string;
    debugMode: boolean;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number; // percentage if not unlocked
}

export interface FavoriteNode {
  nodeId: string;
  addedAt: string;
  notes?: string;
  tags?: string[];
}

export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  photoUrl?: string;
}
