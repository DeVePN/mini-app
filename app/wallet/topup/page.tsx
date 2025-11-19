'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/navigation/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Wallet, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TopUpPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('10');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const quickAmounts = [5, 10, 25, 50, 100];
  const tonToUsd = 5; // Mock exchange rate
  const networkFee = 0.005;
  const total = parseFloat(amount || '0') + networkFee;

  const handleTopUp = async () => {
    setLoading(true);
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push('/wallet');
    }, 1500);
  };

  if (success) {
    return (
      <AppLayout>
        <div className="container max-w-md mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Top-Up Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Your wallet has been credited with {amount} TON
            </p>
            <Button onClick={() => router.push('/wallet')} className="w-full">
              Back to Wallet
            </Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container max-w-md mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/wallet">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Top Up Wallet</h1>
            <p className="text-sm text-muted-foreground">Add TON to your balance</p>
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Amount (TON)</label>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-2xl h-14 pr-16"
                min="1"
                step="0.1"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Badge variant="secondary">TON</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              ≈ ${(parseFloat(amount || '0') * tonToUsd).toFixed(2)} USD
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Quick amounts</label>
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((value) => (
                <Button
                  key={value}
                  variant={amount === value.toString() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAmount(value.toString())}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">{amount || 0} TON</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span className="font-medium">{networkFee} TON</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span>{total.toFixed(3)} TON</span>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleTopUp}
            disabled={!amount || parseFloat(amount) < 1 || loading}
          >
            {loading ? 'Processing...' : `Top Up ${amount || 0} TON`}
          </Button>
        </Card>

        <Card className="p-4 bg-muted">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Minimum top-up amount is 1 TON. Funds will be available immediately after confirmation.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
