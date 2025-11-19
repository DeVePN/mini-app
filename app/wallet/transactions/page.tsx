'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/navigation/AppLayout';
import { TransactionCard } from '@/components/cards/TransactionCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockApi } from '@/lib/mock-api';
import { Transaction } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Filter, Download } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState({ ton: 0, usd: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const [txData, walletBalance] = await Promise.all([
        mockApi.getTransactions(),
        mockApi.getWalletBalance(),
      ]);
      setTransactions(txData.data);
      setBalance(walletBalance);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
  };

  const handleViewExplorer = (hash: string) => {
    window.open(`https://testnet.tonscan.org/tx/${hash}`, '_blank');
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  return (
    <AppLayout balance={balance}>
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/wallet">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <p className="text-sm text-muted-foreground">
              View all your wallet transactions
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="refund">Refunds</SelectItem>
              <SelectItem value="channel_open">Channel Open</SelectItem>
              <SelectItem value="channel_close">Channel Close</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-32 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No transactions found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
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
    </AppLayout>
  );
}
