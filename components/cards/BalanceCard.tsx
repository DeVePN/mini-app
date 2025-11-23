import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import Link from 'next/link';

interface BalanceCardProps {
  balance: {
    ton: number;
    usd: number;
    locked?: number;
    available?: number;
  };
  onTopUp?: () => void;
  onWithdraw?: () => void;
  showActions?: boolean;
}

export function BalanceCard({ balance, onTopUp, onWithdraw, showActions = true }: BalanceCardProps) {
  const [tonConnectUI] = useTonConnectUI();

  // Consider no wallet connected if balance is 0
  const hasWallet = balance.ton > 0 || balance.usd > 0;

  if (!hasWallet) {
    // Show connect wallet prompt
    return (
      <Card className="p-6 bg-gray-100 dark:bg-gray-800 border-2 border-dashed">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-muted-foreground text-sm font-medium mb-1">Wallet Balance</p>
            <h2 className="text-3xl font-bold text-muted-foreground">—</h2>
            <p className="text-muted-foreground text-sm mt-1">Connect your wallet to view balance</p>
          </div>
          <div className="p-3 bg-muted rounded-full">
            <Wallet className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        {showActions && (
          <Button
            className="w-full mt-4"
            onClick={() => tonConnectUI.openModal()}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect TON Wallet
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-green-600 text-white border-0">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-green-100 text-sm font-medium mb-1">Total Balance</p>
          <h2 className="text-4xl font-bold">{balance.ton.toFixed(2)} TON</h2>
          <p className="text-green-100 text-sm mt-1">≈ ${balance.usd.toFixed(2)} USD</p>
        </div>
        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
          <Wallet className="h-6 w-6" />
        </div>
      </div>

      {(balance.locked !== undefined || balance.available !== undefined) && (
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/20">
          {balance.available !== undefined && (
            <div>
              <p className="text-green-100 text-xs mb-1">Available</p>
              <p className="text-lg font-semibold">{balance.available.toFixed(2)} TON</p>
            </div>
          )}
          {balance.locked !== undefined && (
            <div>
              <p className="text-green-100 text-xs mb-1">Locked</p>
              <p className="text-lg font-semibold">{balance.locked.toFixed(2)} TON</p>
            </div>
          )}
        </div>
      )}

      {showActions && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            variant="secondary"
            className="w-full bg-white text-green-600 hover:bg-green-50"
            onClick={onTopUp}
          >
            <ArrowDownLeft className="h-4 w-4 mr-2" />
            Top Up
          </Button>
          <Link href="/wallet/transactions">
            <Button variant="secondary" className="w-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              History
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
