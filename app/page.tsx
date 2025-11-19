'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/navigation/AppLayout';
import { ConnectionStatusCard } from '@/components/cards/ConnectionStatusCard';
import { BalanceCard } from '@/components/cards/BalanceCard';
import { EnhancedNodeCard } from '@/components/cards/EnhancedNodeCard';
import { MetricCard } from '@/components/data-display/MetricCard';
import { Button } from '@/components/ui/button';
import { Globe, Clock, Wallet as WalletIcon, TrendingUp, Server, Award } from 'lucide-react';
import { mockApi } from '@/lib/mock-api';
import { VPNNode, VPNSession } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [activeSession, setActiveSession] = useState<VPNSession | null>(null);
  const [recommendedNodes, setRecommendedNodes] = useState<VPNNode[]>([]);
  const [balance, setBalance] = useState({ ton: 0, usd: 0, locked: 0, available: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [sessions, nodes, walletBalance] = await Promise.all([
          mockApi.getActiveSessions(),
          mockApi.getNodes(),
          mockApi.getWalletBalance(),
        ]);

        setActiveSession(sessions[0] || null);
        setRecommendedNodes(nodes.data.slice(0, 3));
        setBalance(walletBalance);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleDisconnect = async () => {
    // Simulate disconnect
    setActiveSession(null);
  };

  const handleQuickConnect = () => {
    router.push('/nodes');
  };

  const handleConnect = (nodeId: string) => {
    router.push(`/connect/${nodeId}`);
  };

  const handleTopUp = () => {
    router.push('/wallet/topup');
  };

  if (loading) {
    return (
      <AppLayout balance={balance}>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-muted rounded-lg" />
            <div className="grid md:grid-cols-3 gap-4">
              <div className="h-32 bg-muted rounded-lg" />
              <div className="h-32 bg-muted rounded-lg" />
              <div className="h-32 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout balance={balance} notificationCount={2}>
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your VPN overview.</p>
        </div>

        {/* Connection Status */}
        <ConnectionStatusCard
          session={activeSession}
          onDisconnect={handleDisconnect}
          onQuickConnect={handleQuickConnect}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Sessions"
            value="156"
            icon={Clock}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Data Used"
            value="245 GB"
            icon={TrendingUp}
            subtitle="This month"
          />
          <MetricCard
            title="Total Spent"
            value="12.5 TON"
            icon={WalletIcon}
            subtitle="All time"
          />
          <MetricCard
            title="Favorite Nodes"
            value="5"
            icon={Award}
          />
        </div>

        {/* Wallet Balance */}
        <BalanceCard balance={balance} onTopUp={handleTopUp} />

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/nodes">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Globe className="h-6 w-6" />
              <span>Browse Nodes</span>
            </Button>
          </Link>
          <Link href="/sessions">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Clock className="h-6 w-6" />
              <span>My Sessions</span>
            </Button>
          </Link>
          <Link href="/provider/start">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Server className="h-6 w-6" />
              <span>Earn as Provider</span>
            </Button>
          </Link>
        </div>

        {/* Recommended Nodes */}
        {recommendedNodes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Recommended Nodes</h2>
              <Link href="/nodes">
                <Button variant="link">View All</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {recommendedNodes.map((node) => (
                <EnhancedNodeCard
                  key={node.id}
                  node={node}
                  onConnect={handleConnect}
                  variant="grid"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
