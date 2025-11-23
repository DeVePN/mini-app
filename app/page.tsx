'use client';

import { useState, useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { AppLayout } from '@/components/navigation/AppLayout';
import { ConnectionStatusCard } from '@/components/cards/ConnectionStatusCard';
import { BalanceCard } from '@/components/cards/BalanceCard';
import { EnhancedNodeCard } from '@/components/cards/EnhancedNodeCard';
import { MetricCard } from '@/components/data-display/MetricCard';
import { Button } from '@/components/ui/button';
import { RequireWallet } from '@/components/RequireWallet';
import { Globe, Clock, Wallet as WalletIcon, TrendingUp, Server, Award } from 'lucide-react';
import { api } from '@/lib/api';
import { VPNNode, VPNSession } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useWalletBalance } from '@/hooks/use-wallet-balance';

export default function Home() {
  const router = useRouter();
  const walletAddress = useTonAddress();
  const { data: walletBalance } = useWalletBalance();
  const [activeSession, setActiveSession] = useState<VPNSession | null>(null);
  const [recommendedNodes, setRecommendedNodes] = useState<VPNNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalSessions: 0,
    dataUsed: '0 GB',
    totalSpent: '0 TON',
    favoriteNodes: 0
  });

  // Derived balance state for compatibility
  const balance = {
    ton: walletBalance?.ton || 0,
    usd: (walletBalance?.ton || 0) * 5, // Mock exchange rate for now
    locked: 0,
    available: walletBalance?.ton || 0
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Always load nodes for browsing (no auth required)
        const nodes = await api.getNodes();
        setRecommendedNodes(nodes.slice(0, 3));

        // Only load user-specific data if wallet is connected
        if (walletAddress) {
          const session = await api.getActiveSession(walletAddress);
          setActiveSession(session);

          // Load mock user stats only when authenticated
          setUserStats({
            totalSessions: 156,
            dataUsed: '245 GB',
            totalSpent: '12.5 TON',
            favoriteNodes: 5
          });
        } else {
          // Reset to empty state when no wallet
          setActiveSession(null);
          setUserStats({
            totalSessions: 0,
            dataUsed: '0 GB',
            totalSpent: '0 TON',
            favoriteNodes: 0
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [walletAddress]); // Re-run when wallet connection changes

  const handleDisconnect = async () => {
    if (!activeSession) return;
    try {
      await api.stopSession(activeSession.id);
      setActiveSession(null);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
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
          <p className="text-muted-foreground">Welcome back! Here&apos;s your VPN overview.</p>
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
            value={walletAddress ? userStats.totalSessions.toString() : '—'}
            icon={Clock}
            trend={walletAddress ? { value: 12, isPositive: true } : undefined}
            subtitle={!walletAddress ? 'Connect wallet' : undefined}
          />
          <MetricCard
            title="Data Used"
            value={walletAddress ? userStats.dataUsed : '—'}
            icon={TrendingUp}
            subtitle={walletAddress ? 'This month' : 'Connect wallet'}
          />
          <MetricCard
            title="Total Spent"
            value={walletAddress ? userStats.totalSpent : '—'}
            icon={WalletIcon}
            subtitle={walletAddress ? 'All time' : 'Connect wallet'}
          />
          <MetricCard
            title="Favorite Nodes"
            value={walletAddress ? userStats.favoriteNodes.toString() : '—'}
            icon={Award}
            subtitle={!walletAddress ? 'Connect wallet' : undefined}
          />
        </div>

        {/* Wallet Balance */}
        <BalanceCard balance={balance} onTopUp={handleTopUp} />

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Browse Nodes - No auth required */}
          <Link href="/nodes">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Globe className="h-6 w-6" />
              <span>Browse Nodes</span>
            </Button>
          </Link>

          {/* My Sessions - Requires wallet */}
          <RequireWallet
            modalTitle="Connect Wallet to View Sessions"
            modalDescription="Connect your TON wallet to view your VPN session history."
          >
            <Link href="/sessions" className="block">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Clock className="h-6 w-6" />
                <span>My Sessions</span>
              </Button>
            </Link>
          </RequireWallet>

          {/* Earn as Provider - Requires wallet */}
          <RequireWallet
            modalTitle="Connect Wallet to Become Provider"
            modalDescription="Connect your TON wallet to register as a VPN provider and start earning."
          >
            <Link href="/provider/start" className="block">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Server className="h-6 w-6" />
                <span>Earn as Provider</span>
              </Button>
            </Link>
          </RequireWallet>
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
