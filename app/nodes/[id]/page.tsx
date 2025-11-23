'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTonAddress } from '@tonconnect/ui-react';
import { api } from '@/lib/api';
import { telegram } from '@/lib/telegram';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import { RequireWallet } from '@/components/RequireWallet';
import { formatTON, formatAddress, getCountryFlag } from '@/utils/format';
import {
  ArrowLeft,
  Signal,
  Zap,
  MapPin,
  DollarSign,
  Shield,
  Server,
  Star
} from 'lucide-react';

export default function NodeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const nodeId = params.id as string;
  const address = useTonAddress();

  const { data: node, isLoading } = useQuery({
    queryKey: ['node', nodeId],
    queryFn: () => api.getNode(nodeId),
  });

  const { data: stats } = useQuery({
    queryKey: ['nodeStats', nodeId],
    queryFn: () => api.getNodeStats(nodeId),
    refetchInterval: 5000,
  });

  useEffect(() => {
    telegram.showBackButton(() => {
      router.back();
    });

    return () => {
      telegram.hideBackButton();
    };
  }, [router]);

  const handleConnect = () => {
    // Redirect to connection setup page
    router.push(`/connect/${nodeId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!node) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Node not found</h2>
          <Button onClick={() => router.back()} variant="secondary">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to nodes
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{getCountryFlag(node.location.countryCode)}</span>
            <div>
              <h1 className="text-2xl font-bold">{node.location.country}</h1>
              <p className="text-sm text-gray-500">{formatAddress(node.provider.walletAddress)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Status Card */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Node Status</h2>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${node.status === 'online'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
              }`}>
              <div className={`w-2 h-2 rounded-full ${node.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`} />
              {node.status === 'online' ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Latency</p>
                <p className="text-lg font-semibold">{node.statistics.responseTime || '--'}ms</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Signal className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Active Peers</p>
                <p className="text-lg font-semibold">{stats?.activePeers || node.statistics.activeSessions || 0}</p>
              </div>
            </div>

            {node.provider.reputationScore !== undefined && (
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Reputation</p>
                  <p className="text-lg font-semibold">{node.provider.reputationScore} / 100</p>
                </div>
              </div>
            )}

            {stats?.uptime !== undefined && (
              <div className="flex items-start gap-3">
                <Server className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="text-lg font-semibold">{stats.uptime}%</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Pricing Card */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Pricing</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Price per hour</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatTON(node.pricing.pricePerHour)} TON
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>~{formatTON(String(Number(node.pricing.pricePerHour) * 24))} TON/day</p>
              <p>~{formatTON(String(Number(node.pricing.pricePerHour) * 720))} TON/month</p>
            </div>
          </div>
        </Card>

        {/* Technical Details */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Technical Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Server IP</span>
              <span className="font-mono">{node.specifications.publicIP}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Port</span>
              <span className="font-mono">51820</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {node.location.country}
              </span>
            </div>
          </div>
        </Card>

        {/* Connect Button */}
        <div className="sticky bottom-4">
          <RequireWallet
            modalTitle="Connect Wallet to Start VPN Session"
            modalDescription="You need to connect your TON wallet to start a VPN session with this node."
          >
            <Button
              className="w-full"
              size="lg"
              onClick={handleConnect}
              disabled={node.status !== 'online'}
            >
              {node.status !== 'online' ? 'Node Inactive' : 'Connect to VPN'}
            </Button>
          </RequireWallet>
        </div>
      </div>
    </div>
  );
}
