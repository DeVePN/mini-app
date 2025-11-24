'use client';

import { useState, useEffect } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/navigation/AppLayout';
import { SessionCard } from '@/components/cards/SessionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { VPNSession } from '@/types';
import { Clock, Wallet } from 'lucide-react';
import { useWalletBalance } from '@/hooks/use-wallet-balance';

export default function SessionsPage() {
  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const { data: walletBalance } = useWalletBalance();

  // Derived balance state
  const balance = {
    ton: walletBalance?.ton || 0,
    usd: (walletBalance?.ton || 0) * 5
  };

  // Fetch active session (auto-refetch every 5s)
  const { data: activeSession = null, isLoading: activeLoading } = useQuery({
    queryKey: ['activeSession', walletAddress],
    queryFn: () => api.getActiveSession(walletAddress!),
    enabled: !!walletAddress,
    refetchInterval: 5000, // Refetch every 5 seconds
    retry: 1,
  });

  // Fetch all sessions (history - no need to poll)
  const { data: allSessions = [], isLoading: historyLoading } = useQuery({
    queryKey: ['sessions', walletAddress],
    queryFn: () => api.getSessions(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 10000, // Cache for 10 seconds
    retry: 1,
  });

  const activeSessions = activeSession ? [activeSession] : [];
  const sessionHistory = allSessions || [];
  const loading = activeLoading || historyLoading;

  const handleDisconnect = async (sessionId: string) => {
    try {
      await api.stopSession(sessionId);
      // React Query will automatically refetch due to refetchInterval
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  // Show connect wallet prompt if no wallet is connected
  if (!walletAddress) {
    return (
      <AppLayout balance={balance}>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card className="p-12 text-center space-y-6">
            <div className="inline-flex p-6 rounded-full bg-blue-100 dark:bg-blue-900">
              <Wallet className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Connect your TON wallet to view your VPN session history and active connections.
              </p>
            </div>
            <Button size="lg" onClick={() => tonConnectUI.openModal()}>
              <Wallet className="h-5 w-5 mr-2" />
              Connect TON Wallet
            </Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout balance={balance}>
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Sessions</h1>
          <p className="text-muted-foreground">View active and past VPN connections</p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active ({activeSessions.length})</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="h-48 animate-pulse bg-muted" />
                ))}
              </div>
            ) : activeSessions.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
                <p className="text-sm text-muted-foreground">
                  Connect to a VPN node to start a session
                </p>
              </Card>
            ) : (
              activeSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  variant="active"
                  onDisconnect={handleDisconnect}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-6">
            {sessionHistory.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No session history</p>
              </Card>
            ) : (
              sessionHistory.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  variant="history"
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
