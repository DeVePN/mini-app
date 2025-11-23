// VPN Session Types

export type SessionStatus = 'active' | 'completed' | 'failed' | 'disconnected';
export type ConnectionMethod = 'qr' | 'config_file';

export interface SessionMetrics {
  uploadSpeed: number; // Mbps
  downloadSpeed: number; // Mbps
  uploadData: number; // MB
  downloadData: number; // MB
  totalData: number; // MB
  latency: number; // ms
  timestamp: string;
}

export interface SessionConnection {
  serverIP: string;
  clientIP: string;
  protocol: string;
  encryption: string;
  port: number;
}

export interface WireGuardConfig {
  privateKey: string;
  publicKey: string;
  endpoint: string;
  allowedIPs: string;
  dns?: string;
  mtu?: number;
}

export interface VPNSession {
  id: string;
  userId: string;
  nodeId: string;
  nodeName: string;
  nodeLocation: {
    country: string;
    countryCode: string;
    city: string;
  };
  status: SessionStatus;
  startTime: string;
  endTime?: string;
  duration: number; // seconds

  // Metrics
  metrics: {
    current: SessionMetrics;
    history: SessionMetrics[];
  };

  // Connection details
  connection: SessionConnection;
  config?: WireGuardConfig;

  // Payment
  paymentChannelId: string;
  costPerHour: number;
  totalCost: number;
  balanceRemaining: number;
  estimatedTimeLeft: number; // seconds

  // Settings
  autoRenewal: boolean;
  deviceId?: string;

  // Performance events
  events: SessionEvent[];

  // Rating
  rating?: number;
  review?: string;

  createdAt: string;
  updatedAt: string;
}

export interface SessionEvent {
  id: string;
  type: 'connected' | 'disconnected' | 'reconnected' | 'quality_degraded' | 'low_balance' | 'node_changed';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SessionSummary {
  totalSessions: number;
  totalDuration: number; // seconds
  totalDataUsed: number; // GB
  totalCost: number; // TON
  averageSessionLength: number; // seconds
  mostUsedNode?: {
    id: string;
    name: string;
    country: string;
    sessions: number;
  };
}

export interface ActiveSessionControl {
  pause?: boolean;
  disconnect: () => void;
  reconnect: () => void;
  shareQR: () => void;
  reportIssue: (issue: string) => void;
  rateSession: (rating: number, review?: string) => void;
}
