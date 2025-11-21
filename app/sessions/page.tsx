'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/navigation/AppLayout';
import { SessionCard } from '@/components/cards/SessionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { mockApi } from '@/lib/mock-api';
import { VPNSession } from '@/types';
import { Clock } from 'lucide-react';

export default function SessionsPage() {
  const [activeSessions, setActiveSessions] = useState<VPNSession[]>([]);
  const [sessionHistory, setSessionHistory] = useState<VPNSession[]>([]);
  const [balance, setBalance] = useState({ ton: 0, usd: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      // Load mock sessions
      const [active, walletBalance] = await Promise.all([
        mockApi.getActiveSessions(),
        mockApi.getWalletBalance(),
      ]);

      setActiveSessions(active);
      setSessionHistory([]); // Empty history for now
      setBalance(walletBalance);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (sessionId: string) => {
    // Simulate disconnect
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
  };

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
