'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/navigation/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockApi } from '@/lib/mock-api';
import { PaymentChannel } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Layers, X } from 'lucide-react';

export default function ChannelsPage() {
  const [channels, setChannels] = useState<PaymentChannel[]>([]);
  const [balance, setBalance] = useState({ ton: 0, usd: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const [channelData, walletBalance] = await Promise.all([
        mockApi.getPaymentChannels(),
        mockApi.getWalletBalance(),
      ]);
      setChannels(channelData);
      setBalance(walletBalance);
    } catch (error) {
      console.error('Failed to load channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseChannel = async (channelId: string) => {
    if (confirm('Are you sure you want to close this payment channel?')) {
      setChannels(prev => prev.filter(c => c.id !== channelId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'open': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'closing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <AppLayout balance={balance}>
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/wallet">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Payment Channels</h1>
            <p className="text-sm text-muted-foreground">
              Manage your active payment channels
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="h-32 animate-pulse bg-muted" />
            ))}
          </div>
        ) : channels.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
              <Layers className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Payment Channels</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Payment channels are created automatically when you connect to a node
            </p>
            <Link href="/nodes">
              <Button>Browse Nodes</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {channels.map((channel) => (
              <Card key={channel.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{channel.nodeName}</h3>
                      <Badge className={getStatusColor(channel.status)}>
                        {channel.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {channel.nodeLocation.city}, {channel.nodeLocation.country}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCloseChannel(channel.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Locked</p>
                    <p className="font-semibold">{channel.lockedAmount.toFixed(2)} TON</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Used</p>
                    <p className="font-semibold">{channel.usedAmount.toFixed(2)} TON</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                    <p className="font-semibold text-green-600">
                      {channel.remainingAmount.toFixed(2)} TON
                    </p>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{
                      width: `${(channel.usedAmount / channel.lockedAmount) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Created: {new Date(channel.createdAt).toLocaleDateString()}</span>
                  {channel.estimatedTimeRemaining && (
                    <span>
                      ~{Math.floor(channel.estimatedTimeRemaining / 3600)}h remaining
                    </span>
                  )}
                </div>

                {channel.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => handleCloseChannel(channel.id)}
                  >
                    Close Channel
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        <Card className="p-4 bg-muted">
          <h3 className="font-semibold mb-2">About Payment Channels</h3>
          <p className="text-sm text-muted-foreground">
            Payment channels allow fast, low-cost micropayments for VPN usage. Funds are locked when you connect to a node and released when you disconnect.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
