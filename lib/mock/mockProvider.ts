import { ProviderNode, ProviderNodeStats, ProviderDashboard } from '@/types';

export const mockProviderNodes: ProviderNode[] = [
  {
    id: 'provider-node-1',
    nodeId: 'node-1',
    providerWallet: 'EQD...abc123',
    serverInfo: {
      publicIP: '185.230.124.45',
      port: 51820,
      publicKey: 'Wg+PublicKey1==',
      location: {
        country: 'United States',
        countryCode: 'US',
        city: 'New York',
        lat: 40.7128,
        lng: -74.0060,
      },
      specs: {
        cpu: '8 cores @ 3.2GHz',
        ram: '32GB DDR4',
        bandwidth: 1000,
        storage: '500GB NVMe SSD',
      },
    },
    pricing: {
      pricePerHour: '0.05',
      discounts: [
        { duration: 24, discount: 10 },
        { duration: 168, discount: 20 },
      ],
    },
    capacity: {
      maxUsers: 50,
      bandwidthPerUser: 20,
      currentLoad: 24,
    },
    status: {
      online: true,
      acceptingConnections: true,
      maintenanceMode: false,
    },
    stats: {
      earnings: {
        today: '0.5',
        week: '2.8',
        month: '9.6',
        allTime: '45.2',
        pending: '0.12',
      },
      usage: {
        totalSessions: 1234,
        activeSessions: 12,
        uptime: 99.8,
        dataServed: 524288000000,
        averageSessionLength: 7200,
      },
      performance: {
        averageSpeed: 145,
        averageLatency: 12,
        successRate: 99.9,
      },
      users: {
        total: 456,
        active: 12,
        returning: 234,
      },
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-20T15:30:00Z',
  },
  {
    id: 'provider-node-2',
    nodeId: 'node-7',
    providerWallet: 'EQD...abc123',
    serverInfo: {
      publicIP: '199.115.230.67',
      port: 51820,
      publicKey: 'Wg+PublicKey7==',
      location: {
        country: 'United States',
        countryCode: 'US',
        city: 'Los Angeles',
        lat: 34.0522,
        lng: -118.2437,
      },
      specs: {
        cpu: '6 cores @ 3.0GHz',
        ram: '24GB DDR4',
        bandwidth: 750,
        storage: '250GB NVMe SSD',
      },
    },
    pricing: {
      pricePerHour: '0.04',
      discounts: [
        { duration: 24, discount: 15 },
      ],
    },
    capacity: {
      maxUsers: 40,
      bandwidthPerUser: 18,
      currentLoad: 15,
    },
    status: {
      online: true,
      acceptingConnections: true,
      maintenanceMode: false,
    },
    stats: {
      earnings: {
        today: '0.3',
        week: '1.5',
        month: '6.2',
        allTime: '28.9',
        pending: '0.08',
      },
      usage: {
        totalSessions: 856,
        activeSessions: 6,
        uptime: 98.5,
        dataServed: 367001600000,
        averageSessionLength: 6400,
      },
      performance: {
        averageSpeed: 128,
        averageLatency: 18,
        successRate: 99.7,
      },
      users: {
        total: 312,
        active: 6,
        returning: 178,
      },
    },
    createdAt: '2024-03-20T12:00:00Z',
    updatedAt: '2024-12-20T14:45:00Z',
  },
];

export const mockProviderDashboard: ProviderDashboard = {
  provider: {
    wallet: 'EQD...abc123',
    name: 'FastVPN Provider',
    joinDate: '2024-01-15',
    totalStake: '2500',
  },
  summary: {
    totalNodes: 2,
    activeNodes: 2,
    totalEarnings: '74.1',
    pendingEarnings: '0.20',
    totalUsers: 768,
    activeUsers: 18,
  },
  nodes: mockProviderNodes,
  recentActivity: {
    newConnections: 45,
    completedSessions: 89,
    earnings: '2.3',
  },
};

export const getProviderNodeById = (id: string): ProviderNode | undefined => {
  return mockProviderNodes.find(node => node.id === id || node.nodeId === id);
};

export const getProviderEarnings = (period: 'today' | 'week' | 'month' | 'allTime'): string => {
  return mockProviderNodes
    .reduce((sum, node) => sum + parseFloat(node.stats.earnings[period]), 0)
    .toFixed(2);
};
