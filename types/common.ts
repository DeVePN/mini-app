// Common Types

export type NetworkType = 'testnet' | 'mainnet';

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface Location {
  country: string;
  countryCode: string;
  city: string;
  latitude?: number;
  longitude?: number;
}

export interface TimeRange {
  from: string;
  to: string;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface MultiSeriesChartData {
  timestamp: string;
  [key: string]: number | string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpful?: number;
  views?: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  category: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
}

export interface AppSettings {
  version: string;
  buildNumber: string;
  network: NetworkType;
  contracts: {
    nodeRegistry: string;
    paymentChannel: string;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    providerMode: boolean;
    mapView: boolean;
    analytics: boolean;
  };
}
