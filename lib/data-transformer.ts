/**
 * Data Transformer
 * Converts backend API responses to frontend expected format
 */

import { VPNNode } from '@/types';

// Country code mapping
const COUNTRY_CODES: Record<string, string> = {
  'united states': 'US',
  'canada': 'CA',
  'united kingdom': 'UK',
  'germany': 'DE',
  'france': 'FR',
  'japan': 'JP',
  'singapore': 'SG',
  'australia': 'AU',
  'brazil': 'BR',
  'india': 'IN',
};

/**
 * Convert nanoTON to TON decimals
 */
function nanoTonToTon(nanoTon: string | number): number {
  const nano = typeof nanoTon === 'string' ? parseFloat(nanoTon) : nanoTon;
  return nano / 1_000_000_000; // 1 TON = 10^9 nanoTON
}

/**
 * Get country code from country name
 */
function getCountryCode(country: string): string {
  const countryLower = country.toLowerCase();
  return COUNTRY_CODES[countryLower] || country.substring(0, 2).toUpperCase();
}

/**
 * Generate node name from location and ID
 */
function generateNodeName(city: string, country: string, id: number): string {
  const countryCode = getCountryCode(country);
  const cityCode = city.substring(0, 3).toUpperCase();
  return `${countryCode}-${cityCode}-${String(id).padStart(2, '0')}`;
}

/**
 * Transform backend node to frontend VPNNode format
 */
export function transformBackendNode(backendNode: any): VPNNode {
  // Extract backend fields
  const {
    id,
    region = 'unknown',
    country = 'Unknown',
    city = 'Unknown',
    endpoint = '0.0.0.0:51820',
    price_per_gb = '0',
    price_per_minute = '0',
    current_load = 0,
    bandwidth_mbps = 1000,
    version = '1.0.0',
    score = 50,
    status = 'online',
    provider_address = null,
  } = backendNode;

  // Parse endpoint
  const [ipAddress, port] = endpoint.split(':');

  // Calculate pricing
  // Assuming average session: 1 hour, ~1GB data
  const pricePerGbTon = nanoTonToTon(price_per_gb);
  const pricePerMinuteTon = nanoTonToTon(price_per_minute);
  const pricePerHour = pricePerMinuteTon * 60 + pricePerGbTon; // 60 minutes + ~1GB

  // Calculate uptime from score (score 0-100 → uptime 90-99%)
  const uptime = 90 + (score / 10);

  // Determine status based on current_load
  let nodeStatus: 'online' | 'busy' | 'offline' | 'maintenance' = 'online';
  if (current_load >= 90) {
    nodeStatus = 'busy';
  } else if (status === 'offline') {
    nodeStatus = 'offline';
  }

  // Transform to frontend format
  const transformedNode: VPNNode = {
    id: String(id), // Convert number to string
    name: generateNodeName(city, country, id),
    location: {
      country: country.charAt(0).toUpperCase() + country.slice(1).toLowerCase(),
      countryCode: getCountryCode(country),
      city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
      region,
    },
    status: nodeStatus,
    performance: {
      ping: Math.floor(Math.random() * 100) + 10, // Mock: 10-110ms (backend doesn't provide this yet)
      uptime,
      bandwidth: bandwidth_mbps,
      latency: Math.floor(Math.random() * 50) + 10, // Mock: 10-60ms
    },
    pricing: {
      pricePerHour: parseFloat(pricePerHour.toFixed(4)), // Round to 4 decimals
      pricePerGB: parseFloat(pricePerGbTon.toFixed(4)),
      currency: 'TON',
      estimatedDailyCost: parseFloat((pricePerHour * 24).toFixed(4)), // 24 hours
      estimatedMonthlyCost: parseFloat((pricePerHour * 24 * 30).toFixed(4)), // 30 days
      depositRequired: Math.max(1, pricePerHour * 10), // Minimum 1 TON, or 10 hours deposit
    },
    specs: {
      protocol: 'WireGuard',
      encryption: 'ChaCha20-Poly1305',
      ipAddress,
      port: parseInt(port) || 51820,
      version,
    },
    load: {
      current: current_load,
      max: 100,
    },
    provider: provider_address ? {
      walletAddress: provider_address,
      reputationScore: score,
      stakeAmount: 0,
      nodesOperated: 1,
      joinDate: new Date().toISOString(),
      verified: false
    } : undefined,
    features: [],
    isFavorite: false,
    score,
    // Defaults for UI compatibility
    rating: score / 20 || 2.5, // 0-100 score → 0-5 rating
    reviewCount: 0,
    reviews: [],
    activeUsers: Math.floor(current_load / 2) || 0,
    speedTier: bandwidth_mbps >= 1000 ? 'fast' as const : bandwidth_mbps >= 500 ? 'medium' as const : 'slow' as const,
    statistics: {
      uptime: uptime,
      averageSpeed: bandwidth_mbps,
      totalUsersServed: Math.floor(Math.random() * 1000),
      activeSessions: Math.floor(current_load / 5),
      responseTime: Math.floor(Math.random() * 100) + 10,
      bandwidthData: [],
    },
    specifications: {
      publicIP: ipAddress,
      serverType: 'Cloud VPS',
      wireguardVersion: version,
      maxCapacity: 100,
      currentLoad: current_load,
      bandwidthLimit: bandwidth_mbps,
      cpuCores: 4,
      ram: 16,
      storage: 500,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return transformedNode;
}

/**
 * Transform array of backend nodes
 */
export function transformBackendNodes(backendNodes: any[]): VPNNode[] {
  if (!Array.isArray(backendNodes)) {
    console.error('transformBackendNodes: Expected array, got:', typeof backendNodes);
    return [];
  }

  return backendNodes.map(transformBackendNode);
}

/**
 * Transform backend session to frontend format
 */
export function transformBackendSession(backendSession: any): any {
  const {
    id,
    node_id,
    user_wallet_address,
    start_time,
    end_time,
    data_used_bytes = 0,
    duration_seconds = 0,
    status = 'active',
    cost_nanoton = '0',
    nodes: node, // Joined node data
    client_ip,
    wg_client_private_key,
    wg_server_public_key,
    dns_servers,
    payment_channel_id
  } = backendSession;

  // Calculate costs
  const cost = nanoTonToTon(cost_nanoton);
  const pricePerMinute = node?.price_per_minute ? nanoTonToTon(node.price_per_minute) : 0;
  const costPerHour = pricePerMinute * 60;

  // Generate node name if node data exists
  const nodeName = node ? generateNodeName(node.city || 'Unknown', node.country || 'Unknown', node.id) : `Node-${node_id}`;

  // Parse endpoint
  const endpoint = node?.endpoint || '0.0.0.0:51820';
  const [serverIP, portStr] = endpoint.split(':');
  const port = parseInt(portStr) || 51820;

  return {
    id: String(id),
    userId: 'user-1', // Placeholder, not critical for UI
    nodeId: String(node_id),
    nodeName,
    nodeLocation: {
      country: node?.country || 'Unknown',
      countryCode: node?.country ? getCountryCode(node.country) : 'UN',
      city: node?.city || 'Unknown',
    },
    status,
    startTime: start_time,
    endTime: end_time || undefined,
    duration: duration_seconds,

    // Metrics (Mocked for now as backend doesn't store real-time metrics yet)
    metrics: {
      current: {
        uploadSpeed: Math.random() * 10, // Mock
        downloadSpeed: Math.random() * 50, // Mock
        uploadData: (data_used_bytes / (1024 * 1024)) * 0.3, // Mock split
        downloadData: (data_used_bytes / (1024 * 1024)) * 0.7,
        totalData: data_used_bytes / (1024 * 1024), // MB
        latency: 45,
        timestamp: new Date().toISOString(),
      },
      history: []
    },

    // Connection details
    connection: {
      serverIP,
      clientIP: client_ip || '10.8.0.2',
      protocol: 'WireGuard',
      encryption: 'ChaCha20-Poly1305',
      port,
    },

    // WireGuard Config
    config: wg_client_private_key ? {
      privateKey: wg_client_private_key,
      publicKey: 'client-pub-key', // Not strictly needed for config generation if we have private
      endpoint: endpoint,
      allowedIPs: '0.0.0.0/0, ::/0',
      dns: dns_servers ? dns_servers.join(', ') : '1.1.1.1, 8.8.8.8'
    } : undefined,

    // Payment
    paymentChannelId: payment_channel_id,
    costPerHour,
    totalCost: cost,
    balanceRemaining: 0, // TODO: Implement balance tracking
    estimatedTimeLeft: 3600, // Mock: 1 hour

    // Settings
    autoRenewal: false,

    // Events
    events: [],

    createdAt: start_time,
    updatedAt: start_time,
  };
}

/**
 * Transform backend user profile to frontend format
 */
export function transformBackendUser(backendUser: any): any {
  const {
    id,
    wallet_address,
    username,
    telegram_id,
    created_at,
    last_login,
  } = backendUser;

  return {
    id: String(id),
    walletAddress: wallet_address,
    username: username || `user_${wallet_address.substring(0, 6)}`,
    telegramId: telegram_id,
    createdAt: created_at,
    lastLogin: last_login,
  };
}

/**
 * Transform frontend node data to backend format (for registering nodes)
 */
export function transformFrontendNodeToBackend(frontendNode: Partial<VPNNode>): any {
  const {
    location,
    specs,
    pricing,
    performance,
    provider,
  } = frontendNode;

  // Convert TON to nanoTON
  const pricePerGbNano = pricing?.pricePerGB
    ? String(Math.floor(pricing.pricePerGB * 1_000_000_000))
    : '0';
  const pricePerMinuteNano = pricing?.pricePerHour
    ? String(Math.floor((pricing.pricePerHour / 60) * 1_000_000_000))
    : '0';

  return {
    region: location?.region || 'unknown',
    country: location?.country.toLowerCase() || 'unknown',
    city: location?.city.toLowerCase() || 'unknown',
    endpoint: `${specs?.ipAddress || '0.0.0.0'}:${specs?.port || 51820}`,
    price_per_gb: pricePerGbNano,
    price_per_minute: pricePerMinuteNano,
    bandwidth_mbps: performance?.bandwidth || 1000,
    version: specs?.version || '1.0.0',
    provider_address: provider?.walletAddress || null,
  };
}
