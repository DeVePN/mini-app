import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { ArrowUpRight, ArrowDownLeft, Copy, ExternalLink } from 'lucide-react';
import { Transaction, TransactionType } from '@/types';
import { cn } from '@/lib/utils';

interface TransactionCardProps {
  transaction: Transaction;
  onCopyHash?: (hash: string) => void;
  onViewExplorer?: (hash: string) => void;
}

const transactionTypeConfig: Record<TransactionType, { label: string; icon: typeof ArrowUpRight; color: string }> = {
  deposit: { label: 'Deposit', icon: ArrowDownLeft, color: 'text-green-600' },
  withdrawal: { label: 'Withdrawal', icon: ArrowUpRight, color: 'text-red-600' },
  payment: { label: 'Payment', icon: ArrowUpRight, color: 'text-red-600' },
  refund: { label: 'Refund', icon: ArrowDownLeft, color: 'text-green-600' },
  channel_open: { label: 'Channel Open', icon: ArrowUpRight, color: 'text-green-600' },
  channel_close: { label: 'Channel Close', icon: ArrowDownLeft, color: 'text-green-600' },
  stake: { label: 'Stake', icon: ArrowUpRight, color: 'text-green-600' },
  unstake: { label: 'Unstake', icon: ArrowDownLeft, color: 'text-green-600' },
  earning: { label: 'Earning', icon: ArrowDownLeft, color: 'text-green-600' },
};

export function TransactionCard({ transaction, onCopyHash, onViewExplorer }: TransactionCardProps) {
  const config = transactionTypeConfig[transaction.type];
  const Icon = config.icon;

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-full bg-muted', config.color)}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold">{config.label}</p>
            <p className="text-sm text-muted-foreground">{transaction.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn('text-lg font-bold', transaction.amount > 0 ? 'text-green-600' : 'text-red-600')}>
            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(4)} TON
          </p>
          <StatusBadge status={transaction.status} showDot={false} />
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Transaction Hash</span>
          <div className="flex items-center gap-1">
            <span className="font-mono text-xs">{truncateHash(transaction.hash)}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onCopyHash?.(transaction.hash)}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {transaction.fee && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Fee</span>
            <span className="font-medium">{transaction.fee.toFixed(6)} TON</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">
            {new Date(transaction.timestamp).toLocaleString()}
          </span>
        </div>

        {transaction.confirmations !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Confirmations</span>
            <span className="font-medium">{transaction.confirmations}</span>
          </div>
        )}
      </div>

      {onViewExplorer && (
        <Button
          variant="outline"
          className="w-full mt-4 gap-2"
          onClick={() => onViewExplorer(transaction.hash)}
        >
          <ExternalLink className="h-4 w-4" />
          View on Explorer
        </Button>
      )}
    </Card>
  );
}
