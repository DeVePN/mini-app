import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { RequireWallet } from '@/components/RequireWallet';
import { Star, Heart, Users, Zap } from 'lucide-react';
import { VPNNode } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface EnhancedNodeCardProps {
  node: VPNNode;
  onConnect?: (nodeId: string) => void;
  onToggleFavorite?: (nodeId: string, isFavorite: boolean) => void;
  variant?: 'grid' | 'list';
}

export function EnhancedNodeCard({
  node,
  onConnect,
  onToggleFavorite,
  variant = 'grid',
}: EnhancedNodeCardProps) {
  const speedTierColors = {
    fast: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    slow: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  };

  if (variant === 'list') {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{getFlagEmoji(node.location.countryCode)}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/nodes/${node.id}`} className="font-semibold hover:underline truncate">
                {node.name}
              </Link>
              <StatusBadge status={node.status} showDot />
              {node.provider?.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{node.location.city}, {node.location.country}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {node.rating.toFixed(1)} ({node.reviewCount})
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {node.activeUsers}
              </span>
              <Badge className={speedTierColors[node.speedTier]} variant="secondary">
                <Zap className="h-3 w-3 mr-1" />
                {node.speedTier}
              </Badge>
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold">{node.pricing.pricePerHour} TON/h</p>
            <p className="text-xs text-muted-foreground">{node.statistics.averageSpeed} Mbps</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite?.(node.id, !node.isFavorite)}
            >
              <Heart className={cn('h-4 w-4', node.isFavorite && 'fill-red-500 text-red-500')} />
            </Button>
            <RequireWallet
              modalTitle="Connect Wallet to Use VPN"
              modalDescription="Connect your TON wallet to start a VPN session with this node."
            >
              <Button onClick={() => onConnect?.(node.id)}>
                Connect
              </Button>
            </RequireWallet>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{getFlagEmoji(node.location.countryCode)}</span>
          <div>
            <Link href={`/nodes/${node.id}`} className="font-semibold hover:underline">
              {node.name}
            </Link>
            <p className="text-xs text-muted-foreground">{node.location.city}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onToggleFavorite?.(node.id, !node.isFavorite)}
        >
          <Heart className={cn('h-4 w-4', node.isFavorite && 'fill-red-500 text-red-500')} />
        </Button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <StatusBadge status={node.status} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Speed</span>
          <Badge className={speedTierColors[node.speedTier]} variant="secondary">
            <Zap className="h-3 w-3 mr-1" />
            {node.statistics.averageSpeed} Mbps
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Rating</span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {node.rating.toFixed(1)} ({node.reviewCount})
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Users</span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {node.activeUsers}
          </span>
        </div>
      </div>

      <div className="border-t pt-3 mt-3">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-xl font-bold">{node.pricing.pricePerHour} TON/h</p>
          </div>
          {node.provider?.verified && (
            <Badge variant="secondary" className="gap-1">
              ✓ Verified
            </Badge>
          )}
        </div>
        <RequireWallet
          modalTitle="Connect Wallet to Use VPN"
          modalDescription="Connect your TON wallet to start a VPN session with this node."
        >
          <Button className="w-full" onClick={() => onConnect?.(node.id)}>
            Connect
          </Button>
        </RequireWallet>
      </div>
    </Card>
  );
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
