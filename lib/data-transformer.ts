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
      depositRequired: pricePerHour * 10, // 10 hours deposit
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
    provider: provider_address || undefined,
    features: [], // Backend doesn't provide features yet
    isFavorite: false, // This will be updated based on user preferences
    score,
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
    duration_minutes = 0,
    status = 'active',
    total_cost_nanoton = '0',
  } = backendSession;

  return {
    id: String(id),
    nodeId: String(node_id),
    userAddress: user_wallet_address,
    startTime: start_time,
    endTime: end_time || null,
    dataUsed: data_used_bytes,
    duration: duration_minutes,
    status,
    cost: nanoTonToTon(total_cost_nanoton),
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
    provider_address: provider || null,
  };
}
