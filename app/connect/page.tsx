'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CheckCircle, AlertCircle, Shield, DollarSign, Network } from 'lucide-react';
import { useTonConnect Connect } from '@tonconnect/ui-react';
import { useRouter } from 'next/navigation';

export default function ConnectPage() {
  const { connected, wallet, network } = useTonConnect();
  const [balance, setBalance] = useState<number | null>(null);
  const router = useRouter();

  const handleSkip = () => {
    router.push('/nodes');
  };

  const handleContinue = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Connect your TON wallet to start using DeVPN
          </p>
        </div>

        <Card className="p-6 mb-6">
          {!connected ? (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex p-6 rounded-full bg-muted">
                  <Wallet className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">No Wallet Connected</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your TON wallet to access all features
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Secure Connection</p>
                    <p className="text-xs text-muted-foreground">Your keys never leave your wallet</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Easy Payments</p>
                    <p className="text-xs text-muted-foreground">Pay for VPN directly from your wallet</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  <Network className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Testnet Available</p>
                    <p className="text-xs text-muted-foreground">Try with test TON tokens first</p>
                  </div>
                </div>
              </div>

              <TonConnectButton className="w-full" />

              <p className="text-xs text-center text-muted-foreground">
                Don't have a TON wallet?{' '}
                <a
                  href="https://tonkeeper.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Get Tonkeeper
                </a>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex p-6 rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Wallet Connected!</h3>
                  <p className="text-sm text-muted-foreground">
                    You're all set to start using DeVPN
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <span className="text-sm font-medium">Wallet Address</span>
                  <code className="text-xs font-mono">
                    {wallet?.account.address.slice(0, 8)}...{wallet?.account.address.slice(-6)}
                  </code>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <span className="text-sm font-medium">Network</span>
                  <Badge variant={network === 'testnet' ? 'outline' : 'default'}>
                    {network === 'testnet' ? 'Testnet' : 'Mainnet'}
                  </Badge>
                </div>
                {balance !== null && (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <span className="text-sm font-medium">Balance</span>
                    <span className="text-sm font-bold">{balance.toFixed(2)} TON</span>
                  </div>
                )}
              </div>

              <Button className="w-full" size="lg" onClick={handleContinue}>
                Continue to App
              </Button>
            </div>
          )}
        </Card>

        {!connected && (
          <div className="text-center">
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now and browse nodes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
