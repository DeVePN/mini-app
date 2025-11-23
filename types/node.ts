// VPN Node Types

export type SpeedTier = 'fast' | 'medium' | 'slow';
export type NodeStatus = 'online' | 'offline' | 'maintenance' | 'busy';

export interface NodeLocation {
  country: string;
  countryCode: string;
  city: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

export interface NodeSpecifications {
  publicIP: string;
  serverType: string;
  wireguardVersion: string;
  maxCapacity: number;
  currentLoad: number; // percentage
  bandwidthLimit: number; // Mbps
  cpuCores: number;
  ram: number; // GB
  storage: number; // GB
}

export interface NodeStatistics {
  uptime: number; // percentage
  averageSpeed: number; // Mbps
  totalUsersServed: number;
  activeSessions: number;
  responseTime: number; // ms
  bandwidthData: {
    timestamp: string;
    upload: number;
    download: number;
  }[];
}

export interface NodePricing {
  pricePerHour: number; // in TON
  pricePerGB: number; // in TON
  currency: string;
  estimatedDailyCost: number;
  estimatedMonthlyCost: number;
  depositRequired: number;
}

export interface ProviderInfo {
  walletAddress: string;
  providerName?: string;
  reputationScore: number;
  stakeAmount: number;
  nodesOperated: number;
  joinDate: string;
  verified: boolean;
}

export interface NodeReview {
  id: string;
  userId: string;
  username?: string;
  rating: number;
  comment: string;
  createdAt: string;
  sessionId: string;
}

export interface VPNNode {
  id: string;
  name: string;
  location: NodeLocation;
  status: NodeStatus;
  performance?: {
    ping: number;
    uptime: number;
    bandwidth: number;
    latency: number;
  };
  pricing: NodePricing;
  specs?: {
    protocol: string;
    encryption: string;
    ipAddress: string;
    port: number;
    version: string;
  };
  load?: {
    current: number;
    max: number;
  };
  provider?: ProviderInfo;
  features?: string[];
  isFavorite?: boolean;
  score?: number;
  // Required fields that transformer always provides
  rating: number;
  reviewCount: number;
  reviews: NodeReview[];
  activeUsers: number;
  speedTier: SpeedTier;
  specifications: NodeSpecifications;
  statistics: NodeStatistics;
  createdAt: string;
  updatedAt: string;
}

export interface NodeFilters {
  priceRange?: [number, number];
  speedTier?: SpeedTier[];
  countries?: string[];
  regions?: string[];
  minRating?: number;
  onlineOnly?: boolean;
}

export interface NodeSortOptions {
  sortBy: 'price' | 'speed' | 'rating' | 'distance';
  order: 'asc' | 'desc';
}
