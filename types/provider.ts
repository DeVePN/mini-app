// Provider Types

export type ProviderNodeStatus = 'online' | 'offline' | 'maintenance' | 'paused';

export interface ProviderRegistration {
  // Step 1: Server Information
  serverInfo: {
    publicIP: string;
    port: number;
    wireguardPublicKey: string;
    location: {
      country: string;
      countryCode: string;
      city: string;
    };
    specifications: {
      cpuCores: number;
      ram: number; // GB
      bandwidth: number; // Mbps
      storage: number; // GB
    };
  };

  // Step 2: Pricing & Terms
  pricing: {
    pricePerHour: number; // TON
    maxConcurrentUsers: number;
    bandwidthPerUser: number; // Mbps
    termsOfService?: string;
  };

  // Step 3: Stake
  stake: {
    amount: number; // TON
    walletAddress: string;
  };
}

export interface ProviderEarnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  allTime: number;
  pending: number;
  history: {
    date: string;
    amount: number;
  }[];
}

export interface ProviderNodeStatistics {
  activeUsers: number;
  totalSessions: number;
  uptime: number; // percentage
  currentLoad: number; // percentage
  dataServed: number; // TB
  averageSessionLength: number; // seconds
  performance: {
    averageSpeed: number; // Mbps
    currentSpeed: number; // Mbps
    responseTime: number; // ms
    successRate: number; // percentage
  };
  bandwidth: {
    timestamp: string;
    upload: number;
    download: number;
  }[];
}

export interface ConnectedPeer {
  id: string;
  userId: string; // anonymized
  connectedSince: string;
  dataUsed: number; // MB
  currentSpeed: number; // Mbps
  ipAddress: string; // masked
}

export interface ProviderNode {
  id: string;
  providerId: string;
  status: ProviderNodeStatus;
  serverInfo: ProviderRegistration['serverInfo'];
  pricing: ProviderRegistration['pricing'];
  statistics: ProviderNodeStatistics;
  earnings: ProviderEarnings;
  rating: number;
  reviewCount: number;
  reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    sessionId: string;
  }[];
  connectedPeers: ConnectedPeer[];
  settings: ProviderNodeSettings;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderNodeSettings {
  status: {
    acceptingConnections: boolean;
    maintenanceMode: boolean;
    statusMessage?: string;
  };
  pricing: {
    pricePerHour: number;
    promotionalPrice?: number;
    longSessionDiscount?: {
      minHours: number;
      discountPercent: number;
    };
  };
  capacity: {
    maxConcurrentUsers: number;
    bandwidthPerUser: number;
    priorityUsers: boolean;
  };
  availability: {
    operatingHours?: {
      start: string; // HH:mm
      end: string; // HH:mm
    };
    scheduledMaintenance?: {
      start: string;
      end: string;
      reason: string;
    }[];
    autoShutdown?: {
      enabled: boolean;
      idleMinutes: number;
    };
  };
  advanced: {
    loggingLevel: 'none' | 'minimal' | 'detailed';
    firewallRules?: string[];
    bandwidthLimits?: {
      upload: number;
      download: number;
    };
  };
}

export interface ProviderDashboard {
  earnings: ProviderEarnings;
  nodes: ProviderNode[];
  totalStatistics: {
    totalUsers: number;
    totalSessions: number;
    totalDataServed: number; // TB
    averageUptime: number; // percentage
  };
  alerts: ProviderAlert[];
  recentActivity: ProviderActivity[];
}

export interface ProviderAlert {
  id: string;
  type: 'high_load' | 'downtime' | 'payment_received' | 'low_rating' | 'maintenance_needed';
  severity: 'info' | 'warning' | 'error';
  message: string;
  nodeId?: string;
  timestamp: string;
  read: boolean;
}

export interface ProviderActivity {
  id: string;
  type: 'session_started' | 'session_ended' | 'payment_received' | 'review_received' | 'node_status_changed';
  description: string;
  nodeId?: string;
  amount?: number;
  timestamp: string;
}

export interface ProviderRequirements {
  minimumBandwidth: number; // Mbps
  minimumStake: number; // TON
  requiredOS: string[];
  requiredPorts: number[];
  technicalLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface EarningsCalculator {
  inputs: {
    bandwidth: number; // Mbps
    hoursOnline: number;
    pricePerHour: number;
  };
  outputs: {
    dailyEarnings: number;
    monthlyEarnings: number;
    breakEvenTime?: number; // days
  };
}
