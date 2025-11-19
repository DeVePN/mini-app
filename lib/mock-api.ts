// Mock API - For development use
// Import from here when backend is not available

import {
  VPNNode,
  VPNSession,
  Transaction,
  PaymentChannel,
  UserProfile,
  PaginatedResponse,
} from '@/types';
import { mockNodes, mockSessions, mockTransactions, mockChannels, mockUserProfile } from './mock-data';

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Nodes
  async getNodes(filters?: any, page = 1, limit = 20): Promise<PaginatedResponse<VPNNode>> {
    await delay();
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: mockNodes.slice(start, end),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockNodes.length / limit),
        totalItems: mockNodes.length,
        itemsPerPage: limit,
        hasNext: end < mockNodes.length,
        hasPrevious: page > 1,
      },
    };
  },

  async getNodeById(id: string): Promise<VPNNode | null> {
    await delay();
    return mockNodes.find(n => n.id === id) || null;
  },

  // Sessions
  async getActiveSessions(): Promise<VPNSession[]> {
    await delay();
    return mockSessions.filter(s => s.status === 'active');
  },

  async getSessionById(id: string): Promise<VPNSession | null> {
    await delay();
    return mockSessions.find(s => s.id === id) || null;
  },

  async createSession(nodeId: string, depositAmount: number): Promise<VPNSession> {
    await delay(1500); // Simulate connection setup time
    const node = mockNodes.find(n => n.id === nodeId);
    if (!node) throw new Error('Node not found');

    const newSession: VPNSession = {
      id: `session-${Date.now()}`,
      userId: 'user-1',
      nodeId: node.id,
      nodeName: node.name,
      nodeLocation: {
        country: node.location.country,
        countryCode: node.location.countryCode,
        city: node.location.city,
      },
      status: 'active',
      startTime: new Date().toISOString(),
      duration: 0,
      metrics: {
        current: {
          uploadSpeed: 0,
          downloadSpeed: 0,
          uploadData: 0,
          downloadData: 0,
          totalData: 0,
          latency: node.statistics.responseTime,
          timestamp: new Date().toISOString(),
        },
        history: [],
      },
      connection: {
        serverIP: node.specifications.publicIP,
        clientIP: '10.8.0.2',
        protocol: 'WireGuard',
        encryption: 'ChaCha20-Poly1305',
        port: 51820,
      },
      config: {
        privateKey: 'MOCK_PRIVATE_KEY_' + Math.random().toString(36).substring(7),
        publicKey: 'MOCK_PUBLIC_KEY_' + Math.random().toString(36).substring(7),
        endpoint: `${node.specifications.publicIP}:51820`,
        allowedIPs: '0.0.0.0/0',
        dns: '1.1.1.1',
        mtu: 1420,
      },
      paymentChannelId: `channel-${Date.now()}`,
      costPerHour: node.pricing.pricePerHour,
      totalCost: 0,
      balanceRemaining: depositAmount,
      estimatedTimeLeft: (depositAmount / node.pricing.pricePerHour) * 3600,
      autoRenewal: false,
      events: [
        {
          id: `event-${Date.now()}`,
          type: 'connected',
          message: 'Successfully connected to VPN node',
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock sessions (in real app, this would be stored in backend)
    mockSessions.unshift(newSession);

    return newSession;
  },

  // Wallet
  async getWalletBalance() {
    await delay();
    return { ton: 25.48, usd: 127.40, locked: 5.0, available: 20.48 };
  },

  async getTransactions(page = 1, limit = 20): Promise<PaginatedResponse<Transaction>> {
    await delay();
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: mockTransactions.slice(start, end),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockTransactions.length / limit),
        totalItems: mockTransactions.length,
        itemsPerPage: limit,
        hasNext: end < mockTransactions.length,
        hasPrevious: page > 1,
      },
    };
  },

  async getPaymentChannels(): Promise<PaymentChannel[]> {
    await delay();
    return mockChannels;
  },

  // User
  async getUserProfile(): Promise<UserProfile> {
    await delay();
    return mockUserProfile;
  },
};
