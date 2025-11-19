'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/navigation/AppLayout';
import { BalanceCard } from '@/components/cards/BalanceCard';
import { TransactionCard } from '@/components/cards/TransactionCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockApi } from '@/lib/mock-api';
import { Transaction, PaymentChannel } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ArrowDownLeft, Layers } from 'lucide-react';

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState({ ton: 0, usd: 0, locked: 0, available: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [channels, setChannels] = useState<PaymentChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [walletBalance, txData, channelData] = await Promise.all([
        mockApi.getWalletBalance(),
        mockApi.getTransactions(),
        mockApi.getPaymentChannels(),
      ]);

      setBalance(walletBalance);
      setTransactions(txData.data.slice(0, 5));
      setChannels(channelData);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = () => {
    router.push('/wallet/topup');
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    // Show toast notification
  };

  const handleViewExplorer = (hash: string) => {
    window.open(`https://testnet.tonscan.org/tx/${hash}`, '_blank');
  };

  if (loading) {
    return (
      <AppLayout balance={balance}>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout balance={balance}>
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage your TON balance and transactions</p>
        </div>

        {/* Balance Card */}
        <BalanceCard balance={balance} onTopUp={handleTopUp} />

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/wallet/topup" className="block">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <ArrowDownLeft className="h-6 w-6" />
              <span>Top Up</span>
            </Button>
          </Link>
          <Link href="/wallet/channels" className="block">
            <Button variant="outline" className="w-full h-20 flex-col gap-2 relative">
              <Layers className="h-6 w-6" />
              <span>Payment Channels</span>
              {channels.length > 0 && (
                <Badge className="absolute top-2 right-2">{channels.length}</Badge>
              )}
            </Button>
          </Link>
          <Link href="/wallet/transactions" className="block">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <ArrowUpRight className="h-6 w-6" />
              <span>All Transactions</span>
            </Button>
          </Link>
        </div>

        {/* Active Payment Channels */}
        {channels.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Active Channels</h2>
              <Link href="/wallet/channels">
                <Button variant="link" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {channels.slice(0, 2).map((channel) => (
                <Card key={channel.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{channel.nodeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {channel.nodeLocation.city}, {channel.nodeLocation.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{channel.remainingAmount.toFixed(2)} TON</p>
                      <p className="text-xs text-muted-foreground">
                        of {channel.lockedAmount.toFixed(2)} TON
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <Link href="/wallet/transactions">
              <Button variant="link" size="sm">View All</Button>
            </Link>
          </div>
          {transactions.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No transactions yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  transaction={tx}
                  onCopyHash={handleCopyHash}
                  onViewExplorer={handleViewExplorer}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
