import { UserProfile, TelegramUser, Achievement, Notification } from '@/types';

export const mockTelegramUser: TelegramUser = {
  id: 123456789,
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  languageCode: 'en',
  photoUrl: undefined,
};

export const mockUserProfile: UserProfile = {
  id: 'user-1',
  telegramUser: mockTelegramUser,
  wallet: 'EQD...userWallet1',
  role: 'consumer',
  memberSince: '2024-01-01T00:00:00Z',
  reputationScore: 4.8,
  stats: {
    totalSessions: 156,
    totalTime: 1231380, // ~342 hours
    totalData: 262144000000, // ~245 GB
    totalSpent: '12.5',
    favoriteNode: 'node-1',
    mostUsedCountry: 'United States',
  },
  settings: {
    connection: {
      autoConnect: false,
      autoReconnect: true,
      preferredMethod: 'qr',
      killSwitch: false,
    },
    payment: {
      defaultDuration: 3,
      autoRenewal: false,
      lowBalanceThreshold: 5.0,
    },
    notifications: {
      sessionStatus: true,
      paymentConfirmations: true,
      lowBalance: true,
      nodeStatus: true,
      providerEarnings: false,
      newFeatures: true,
    },
    display: {
      theme: 'auto',
      language: 'en',
      dataUnits: 'mb-gb',
      speedUnits: 'mbps',
      currency: 'both',
    },
    privacy: {
      showActivityStatus: true,
      allowAnalytics: true,
      shareUsageStats: true,
    },
  },
  favorites: ['node-1', 'node-3', 'node-4'],
};

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    name: 'First Connection',
    description: 'Connected to your first VPN node',
    icon: '🎯',
    unlockedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'ach-2',
    name: 'Power User',
    description: 'Completed 100 VPN sessions',
    icon: '⚡',
    unlockedAt: '2024-06-15T14:30:00Z',
  },
  {
    id: 'ach-3',
    name: 'Data Champion',
    description: 'Used over 1TB of data',
    icon: '💾',
    unlockedAt: '2024-09-20T09:15:00Z',
  },
  {
    id: 'ach-4',
    name: 'Node Supporter',
    description: 'Connected to 10 different nodes',
    icon: '🌐',
    unlockedAt: '2024-04-10T16:45:00Z',
  },
  {
    id: 'ach-5',
    name: 'Globe Trotter',
    description: 'Connected to nodes in 5+ countries',
    icon: '🌍',
    unlockedAt: '2024-07-05T11:20:00Z',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'session',
    title: 'Session Active',
    message: 'Your VPN session is currently active',
    read: false,
    actionUrl: '/session/session-1',
    createdAt: '2024-12-20T14:00:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'payment',
    title: 'Payment Confirmed',
    message: 'Payment channel opened successfully - 2.0 TON locked',
    read: true,
    actionUrl: '/wallet/channels',
    createdAt: '2024-12-20T14:00:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'node',
    title: 'Favorite Node Online',
    message: 'Your favorite node in Singapore is back online',
    read: true,
    actionUrl: '/nodes/node-3',
    createdAt: '2024-12-20T10:30:00Z',
  },
  {
    id: 'notif-4',
    userId: 'user-1',
    type: 'system',
    title: 'New Features',
    message: 'Check out the new provider dashboard and node analytics!',
    read: false,
    createdAt: '2024-12-19T08:00:00Z',
  },
];

export const getUnreadNotifications = (): Notification[] => {
  return mockNotifications.filter(n => !n.read);
};

export const getUnlockedAchievements = (): Achievement[] => {
  return mockAchievements.filter(a => a.unlockedAt !== undefined);
};
