import axios, { AxiosInstance } from 'axios';
import { VPNNode, VPNSession as Session } from '@/types';
import { transformBackendNodes, transformBackendNode, transformBackendSession } from './data-transformer';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    if (!backendUrl.startsWith('http')) {
      backendUrl = `https://${backendUrl}`;
    }
    const baseURL = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add interceptors
    this.client.interceptors.request.use(
      (config) => {
        // Add Telegram init data for authentication
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          config.headers['X-Telegram-Init-Data'] = window.Telegram.WebApp.initData;
        }

        // Add wallet address for authentication (if available)
        // Try to get it from TON Connect state in localStorage
        if (typeof window !== 'undefined') {
          try {
            const tonConnectState = localStorage.getItem('ton-connect-ui_wallet-info');
            if (tonConnectState) {
              const walletInfo = JSON.parse(tonConnectState);
              const walletAddress = walletInfo?.account?.address;
              if (walletAddress) {
                config.headers['X-Wallet-Address'] = walletAddress;
              }
            }
          } catch (err) {
            // Silently fail if we can't get wallet address
            console.debug('Could not get wallet address from TON Connect state');
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Node endpoints
  async getNodes(): Promise<VPNNode[]> {
    const response = await this.client.get('/nodes');
    // Transform backend data to frontend format
    return transformBackendNodes(response.data);
  }

  async getNode(id: string): Promise<VPNNode> {
    const response = await this.client.get(`/nodes/${id}`);
    // Transform backend data to frontend format
    return transformBackendNode(response.data);
  }

  async registerNode(data: {
    wallet: string;
    publicKey: string;
    ip: string;
    port: number;
    country: string;
    countryCode: string;
    pricePerSecond: string;
  }): Promise<VPNNode> {
    const response = await this.client.post('/node/register', data);
    return response.data;
  }

  // Session endpoints
  async startSession(data: {
    userWallet: string;
    nodeId: string;
    depositAmount: number;
    transactionBoc?: string;
  }): Promise<Session> {
    const response = await this.client.post('/session/start', data);
    return response.data.session;
  }

  async stopSession(sessionId: string): Promise<{ success: boolean; session: Session }> {
    const response = await this.client.post('/session/stop', { sessionId });
    return response.data;
  }

  async getSession(sessionId: string): Promise<Session> {
    const response = await this.client.get(`/session/${sessionId}`);
    return response.data;
  }

  async getSessions(userWallet: string): Promise<Session[]> {
    const response = await this.client.get(`/sessions/${userWallet}`);
    return response.data;
  }

  async getActiveSession(userWallet: string): Promise<Session | null> {
    const response = await this.client.get(`/session/active/${userWallet}`);
    return response.data.session;
  }

  // Stats endpoints
  async getNodeStats(nodeId: string): Promise<{
    bandwidth: number;
    activePeers: number;
    uptime: number;
  }> {
    const response = await this.client.get(`/nodes/${nodeId}/stats`);
    return response.data;
  }

  async getUserStats(walletAddress: string): Promise<{
    totalSessions: number;
    activeSessions: number;
    totalDataUsed: number;
    totalSpent: number;
    totalDuration: number;
    recentSessions: any[];
  }> {
    const response = await this.client.get(`/stats/user/${walletAddress}`);
    return response.data.stats;
  }

  // Expose client for custom requests (with automatic headers)
  get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export const api = new APIClient();
