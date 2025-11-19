import axios, { AxiosInstance } from 'axios';
import { VPNNode, Session } from '@/types';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
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
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Node endpoints
  async getNodes(): Promise<VPNNode[]> {
    const response = await this.client.get('/nodes');
    return response.data;
  }

  async getNode(id: string): Promise<VPNNode> {
    const response = await this.client.get(`/nodes/${id}`);
    return response.data;
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
  }): Promise<Session> {
    const response = await this.client.post('/session/start', data);
    return response.data;
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
    return response.data;
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
}

export const api = new APIClient();
