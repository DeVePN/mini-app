/**
 * Mock API Service
 * Simulates backend API calls with mock data
 * Replace these with real API calls when backend is ready
 */

import {
  VPNNode,
  Session,
  WalletBalance,
  PaymentChannel,
  Transaction,
  UserProfile,
  ProviderDashboard,
  ProviderNode,
  NodeStats,
  NodeReview,
  NodeFilters,
  Notification,
  Achievement,
} from '@/types';

import {
  mockNodes,
  mockNodeReviews,
  mockNodeStats,
  mockSessions,
  mockSessionHistory,
  getActiveSession,
  getSessionById,
  mockWalletBalance,
  mockPaymentChannels,
  mockTransactions,
  getActiveChannels,
  mockProviderDashboard,
  mockProviderNodes,
  getProviderNodeById,
  mockUserProfile,
  mockNotifications,
  mockAchievements,
  getUnreadNotifications,
  getUnlockedAchievements,
} from '../mock';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ========== Node API ==========
export const api = {
  nodes: {
    getAll: async (filters?: NodeFilters): Promise<VPNNode[]> => {
      await delay();
      let nodes = [...mockNodes];

      if (filters) {
        if (filters.search) {
          const search = filters.search.toLowerCase();
          nodes = nodes.filter(
            n =>
              n.country.toLowerCase().includes(search) ||
              n.city.toLowerCase().includes(search) ||
              n.provider.name.toLowerCase().includes(search)
          );
        }

        if (filters.country) {
          nodes = nodes.filter(n => n.countryCode === filters.country);
        }

        if (filters.priceRange) {
          nodes = nodes.filter(
            n =>
              parseFloat(n.pricePerHour) >= filters.priceRange!.min &&
              parseFloat(n.pricePerHour) <= filters.priceRange!.max
          );
        }

        if (filters.speedTier) {
          const speedRanges = {
            fast: 500,
            medium: 200,
            slow: 0,
          };
          nodes = nodes.filter(n => n.bandwidth >= speedRanges[filters.speedTier!]);
        }

        if (filters.minRating) {
          nodes = nodes.filter(n => n.reputation >= filters.minRating!);
        }

        if (filters.onlineOnly) {
          nodes = nodes.filter(n => n.isOnline);
        }

        // Sorting
        if (filters.sortBy) {
          nodes.sort((a, b) => {
            let comparison = 0;
            switch (filters.sortBy) {
              case 'price':
                comparison = parseFloat(a.pricePerHour) - parseFloat(b.pricePerHour);
                break;
              case 'speed':
                comparison = b.bandwidth - a.bandwidth;
                break;
              case 'rating':
                comparison = b.reputation - a.reputation;
                break;
              case 'distance':
                comparison = a.latency - b.latency;
                break;
            }
            return filters.sortOrder === 'desc' ? -comparison : comparison;
          });
        }
      }

      return nodes;
    },

    getById: async (id: string): Promise<VPNNode | null> => {
      await delay();
      return mockNodes.find(n => n.id === id) || null;
    },

    getStats: async (id: string): Promise<NodeStats | null> => {
      await delay();
      return mockNodeStats[id] || null;
    },

    getReviews: async (id: string): Promise<NodeReview[]> => {
      await delay();
      return mockNodeReviews[id] || [];
    },
  },

  // ========== Session API ==========
  sessions: {
    getActive: async (): Promise<Session | null> => {
      await delay();
      return getActiveSession();
    },

    getById: async (id: string): Promise<Session | null> => {
      await delay();
      return getSessionById(id) || null;
    },

    getHistory: async (): Promise<Session[]> => {
      await delay();
      return mockSessionHistory;
    },

    start: async (nodeId: string, duration: number): Promise<Session> => {
      await delay(1000);
      // Simulate creating a new session
      const node = mockNodes.find(n => n.id === nodeId);
      if (!node) throw new Error('Node not found');

      const newSession: Session = {
        id: `session-${Date.now()}`,
        userId: 'user-1',
        userWallet: 'EQD...userWallet1',
        nodeId,
        node,
        clientPublicKey: `ClientPubKey${Date.now()}==`,
        clientPrivateKey: `ClientPrivKey${Date.now()}==`,
        serverPublicKey: node.publicKey,
        clientIP: '10.8.0.10',
        serverIP: node.ip,
        serverPort: node.port,
        config: `[Interface]
PrivateKey = ClientPrivKey${Date.now()}==
Address = 10.8.0.10/24
DNS = 1.1.1.1

[Peer]
PublicKey = ${node.publicKey}
Endpoint = ${node.ip}:${node.port}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25`,
        status: 'active',
        startTime: new Date().toISOString(),
        duration: 0,
        dataUsed: {
          upload: 0,
          download: 0,
          total: 0,
        },
        currentSpeed: {
          upload: 0,
          download: 0,
        },
        paymentChannelId: `channel-${Date.now()}`,
        totalCost: '0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return newSession;
    },

    stop: async (id: string): Promise<Session> => {
      await delay(800);
      const session = getSessionById(id);
      if (!session) throw new Error('Session not found');

      return {
        ...session,
        status: 'stopped',
        endTime: new Date().toISOString(),
      };
    },
  },

  // ========== Wallet API ==========
  wallet: {
    getBalance: async (): Promise<WalletBalance> => {
      await delay();
      return mockWalletBalance;
    },

    getChannels: async (): Promise<PaymentChannel[]> => {
      await delay();
      return mockPaymentChannels;
    },

    getActiveChannels: async (): Promise<PaymentChannel[]> => {
      await delay();
      return getActiveChannels();
    },

    getTransactions: async (): Promise<Transaction[]> => {
      await delay();
      return mockTransactions;
    },

    topUp: async (amount: string): Promise<Transaction> => {
      await delay(1500);
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        hash: `hash${Date.now()}...`,
        wallet: mockWalletBalance.wallet,
        type: 'deposit',
        amount,
        fee: '0.01',
        status: 'pending',
        description: 'Wallet top-up',
        timestamp: new Date().toISOString(),
      };
      return newTx;
    },

    openChannel: async (nodeId: string, amount: string): Promise<PaymentChannel> => {
      await delay(2000);
      const node = mockNodes.find(n => n.id === nodeId);
      if (!node) throw new Error('Node not found');

      const newChannel: PaymentChannel = {
        id: `channel-${Date.now()}`,
        address: `EQC...channel${Date.now()}`,
        userWallet: mockWalletBalance.wallet,
        nodeWallet: node.wallet,
        nodeId,
        nodeName: `${node.country} - ${node.city}`,
        status: 'open',
        lockedAmount: amount,
        usedAmount: '0',
        remainingAmount: amount,
        createdAt: new Date().toISOString(),
        autoClose: true,
      };
      return newChannel;
    },

    closeChannel: async (channelId: string): Promise<PaymentChannel> => {
      await delay(1500);
      const channel = mockPaymentChannels.find(c => c.id === channelId);
      if (!channel) throw new Error('Channel not found');

      return {
        ...channel,
        status: 'closed',
        closedAt: new Date().toISOString(),
      };
    },
  },

  // ========== Provider API ==========
  provider: {
    getDashboard: async (): Promise<ProviderDashboard> => {
      await delay();
      return mockProviderDashboard;
    },

    getNodes: async (): Promise<ProviderNode[]> => {
      await delay();
      return mockProviderNodes;
    },

    getNodeById: async (id: string): Promise<ProviderNode | null> => {
      await delay();
      return getProviderNodeById(id) || null;
    },

    registerNode: async (nodeData: Partial<ProviderNode>): Promise<ProviderNode> => {
      await delay(2000);
      // Simulate node registration
      const newNode: ProviderNode = {
        ...nodeData,
        id: `provider-node-${Date.now()}`,
        nodeId: `node-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as ProviderNode;
      return newNode;
    },

    updateNode: async (id: string, updates: Partial<ProviderNode>): Promise<ProviderNode> => {
      await delay(1000);
      const node = getProviderNodeById(id);
      if (!node) throw new Error('Node not found');

      return {
        ...node,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    },
  },

  // ========== User API ==========
  user: {
    getProfile: async (): Promise<UserProfile> => {
      await delay();
      return mockUserProfile;
    },

    updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
      await delay(800);
      return {
        ...mockUserProfile,
        ...updates,
      };
    },

    updateSettings: async (settings: Partial<UserProfile['settings']>): Promise<UserProfile> => {
      await delay(500);
      return {
        ...mockUserProfile,
        settings: {
          ...mockUserProfile.settings,
          ...settings,
        },
      };
    },

    getFavorites: async (): Promise<VPNNode[]> => {
      await delay();
      return mockNodes.filter(n => mockUserProfile.favorites.includes(n.id));
    },

    addFavorite: async (nodeId: string): Promise<string[]> => {
      await delay(300);
      if (!mockUserProfile.favorites.includes(nodeId)) {
        return [...mockUserProfile.favorites, nodeId];
      }
      return mockUserProfile.favorites;
    },

    removeFavorite: async (nodeId: string): Promise<string[]> => {
      await delay(300);
      return mockUserProfile.favorites.filter(id => id !== nodeId);
    },
  },

  // ========== Notifications API ==========
  notifications: {
    getAll: async (): Promise<Notification[]> => {
      await delay();
      return mockNotifications;
    },

    getUnread: async (): Promise<Notification[]> => {
      await delay();
      return getUnreadNotifications();
    },

    markAsRead: async (id: string): Promise<void> => {
      await delay(200);
      // Simulate marking as read
    },

    markAllAsRead: async (): Promise<void> => {
      await delay(300);
      // Simulate marking all as read
    },
  },

  // ========== Achievements API ==========
  achievements: {
    getAll: async (): Promise<Achievement[]> => {
      await delay();
      return mockAchievements;
    },

    getUnlocked: async (): Promise<Achievement[]> => {
      await delay();
      return getUnlockedAchievements();
    },
  },
};

export default api;
