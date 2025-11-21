/**
 * Data Adapters: Transform Backend API responses to Mini App types
 * Handles type conversions, field mapping, and provides sensible defaults
 */

import { VPNNode, Session } from '@/types';

/**
 * Country code mapping (simplified for hackathon)
 */
const COUNTRY_CODES: Record<string, string> = {
  'Indonesia': 'ID',
  'Singapore': 'SG',
  'United States': 'US',
  'Germany': 'DE',
  'Japan': 'JP',
  'United Kingdom': 'GB',
  'France': 'FR',
  'Netherlands': 'NL',
  'Australia': 'AU',
  'Canada': 'CA',
};

function getCountryCode(country: string): string {
  return COUNTRY_CODES[country] || 'XX';
}

/**
 * Speed tier based on bandwidth
 */
function getSpeedTier(bandwidthMbps: number): 'basic' | 'standard' | 'premium' | 'ultra' {
  if (bandwidthMbps >= 1000) return 'ultra';
  if (bandwidthMbps >= 500) return 'premium';
  if (bandwidthMbps >= 100) return 'standard';
  return 'basic';
}

/**
 * Status based on last heartbeat
 */
function getNodeStatus(lastHeartbeat: string | null, isActive: boolean): 'online' | 'offline' | 'maintenance' {
  if (!isActive || !lastHeartbeat) return 'offline';

  const heartbeatTime = new Date(lastHeartbeat).getTime();
  const now = Date.now();
  const minutesAgo = (now - heartbeatTime) / (1000 * 60);

  if (minutesAgo > 10) return 'offline';
  return 'online';
}

/**
 * Transform Backend node data to Mini App VPNNode type
 */
export function adaptBackendNodeToVPNNode(backendNode: any): VPNNode {
  const pricePerMinuteNanoTON = Number(backendNode.price_per_minute || 0);
  const pricePerGbNanoTON = Number(backendNode.price_per_gb || 0);

  // Convert nanoTON to TON and calculate per hour
  const pricePerHour = (pricePerMinuteNanoTON * 60) / 1e9;
  const estimatedDailyCost = pricePerHour * 24;
  const estimatedMonthlyCost = estimatedDailyCost * 30;

  const bandwidthMbps = backendNode.bandwidth_mbps || 100;
  const speedTier = getSpeedTier(bandwidthMbps);
  const status = getNodeStatus(backendNode.last_heartbeat, backendNode.is_active);

  return {
    id: String(backendNode.id),
    name: `${backendNode.country}-${backendNode.city}-${backendNode.id}`,
    location: {
      country: backendNode.country || 'Unknown',
      countryCode: getCountryCode(backendNode.country || ''),
      city: backendNode.city || 'Unknown',
      latitude: 0, // Backend doesn't provide coordinates
      longitude: 0,
    },
    status: status,
    speedTier: speedTier,
    pricing: {
      pricePerHour: pricePerHour,
      estimatedDailyCost: estimatedDailyCost,
      estimatedMonthlyCost: estimatedMonthlyCost,
      depositRequired: pricePerHour * 2, // Require 2 hours upfront
    },
    provider: {
      name: backendNode.owner_wallet ? `Provider ${backendNode.owner_wallet.slice(0, 6)}` : 'Anonymous',
      verified: true,
      trustScore: Math.min(100, (backendNode.score || 50) * 2),
      nodeCount: 1,
    },
    specifications: {
      bandwidth: `${bandwidthMbps} Mbps`,
      maxConnections: backendNode.max_peers || 10,
      protocol: 'WireGuard',
      encryption: 'ChaCha20-Poly1305',
      publicIP: backendNode.endpoint ? backendNode.endpoint.split(':')[0] : '127.0.0.1',
      ports: [parseInt(backendNode.endpoint?.split(':')[1] || '51820')],
      version: backendNode.version || '1.0.0',
    },
    statistics: {
      uptime: Math.max(0, 100 - (backendNode.current_load || 0)),
      averageSpeed: bandwidthMbps * 0.8, // Assume 80% of max bandwidth
      activeConnections: Math.floor((backendNode.current_load || 0) / 10),
      totalDataServed: 0, // Backend doesn't track this yet
      responseTime: Math.floor(Math.random() * 50) + 10, // Mock: 10-60ms
    },
    rating: Math.min(5, (backendNode.score || 50) / 20), // Convert score (0-100) to rating (0-5)
    reviewCount: 0, // Backend doesn't have reviews
    reviews: [],
    activeUsers: Math.floor((backendNode.current_load || 0) / 10),
    isFavorite: false,
    createdAt: backendNode.created_at || new Date().toISOString(),
    updatedAt: backendNode.updated_at || new Date().toISOString(),
  };
}

/**
 * Transform Backend session data to Mini App Session type
 */
export function adaptBackendSessionToSession(backendSession: any): Session {
  return {
    id: backendSession.session_token || backendSession.id || String(Date.now()),
    userWallet: backendSession.user_wallet || 'unknown',
    nodeId: String(backendSession.node_id || backendSession.node?.id || '0'),
    node: {
      id: String(backendSession.node_id || '0'),
      country: backendSession.node?.country || 'Unknown',
      countryCode: getCountryCode(backendSession.node?.country || ''),
      pricePerSecond: backendSession.node?.price_per_minute
        ? String(Number(backendSession.node.price_per_minute) / 60 / 1e9)
        : '0',
    },
    startTime: backendSession.start_time || backendSession.created_at || new Date().toISOString(),
    endTime: backendSession.end_time,
    status: backendSession.status || 'active',
    serverIP: backendSession.node?.endpoint ? backendSession.node.endpoint.split(':')[0] : '127.0.0.1',
    serverPort: backendSession.node?.endpoint ? parseInt(backendSession.node.endpoint.split(':')[1]) : 51820,
    clientIP: backendSession.client_ip || '10.10.0.2',
    config: backendSession.wireguard_config || backendSession.config,
    bytesTransferred: backendSession.bytes_used || backendSession.bytesTransferred || 0,
    totalCost: backendSession.total_cost ? String(backendSession.total_cost) : undefined,
    paymentChannelAddress: backendSession.payment_channel_address,
  };
}

/**
 * Transform Backend nodes array response
 */
export function adaptBackendNodesResponse(backendResponse: any): VPNNode[] {
  if (!backendResponse) return [];

  // Handle both formats: { nodes: [] } and { data: [] }
  const nodes = backendResponse.nodes || backendResponse.data || backendResponse;

  if (!Array.isArray(nodes)) {
    console.error('Invalid nodes response:', backendResponse);
    return [];
  }

  return nodes.map(adaptBackendNodeToVPNNode);
}

/**
 * Transform Backend sessions array response
 */
export function adaptBackendSessionsResponse(backendResponse: any): Session[] {
  if (!backendResponse) return [];

  // Handle both formats: { sessions: [] } and { data: [] }
  const sessions = backendResponse.sessions || backendResponse.data || backendResponse;

  if (!Array.isArray(sessions)) {
    console.error('Invalid sessions response:', backendResponse);
    return [];
  }

  return sessions.map(adaptBackendSessionToSession);
}
