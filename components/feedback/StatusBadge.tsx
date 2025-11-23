import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';

type Status = 'online' | 'offline' | 'active' | 'pending' | 'completed' | 'failed' | 'maintenance' | 'connected' | 'disconnected' | 'confirmed';

const statusConfig: Record<Status, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  online: { label: 'Online', variant: 'default', color: 'text-green-500' },
  offline: { label: 'Offline', variant: 'secondary', color: 'text-gray-500' },
  active: { label: 'Active', variant: 'default', color: 'text-green-500' },
  connected: { label: 'Connected', variant: 'default', color: 'text-green-500' },
  disconnected: { label: 'Disconnected', variant: 'secondary', color: 'text-gray-500' },
  pending: { label: 'Pending', variant: 'outline', color: 'text-yellow-500' },
  completed: { label: 'Completed', variant: 'secondary', color: 'text-green-500' },
  confirmed: { label: 'Confirmed', variant: 'default', color: 'text-green-500' },
  failed: { label: 'Failed', variant: 'destructive', color: 'text-red-500' },
  maintenance: { label: 'Maintenance', variant: 'outline', color: 'text-orange-500' },
};

interface StatusBadgeProps {
  status: Status;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, showDot = true, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  // Fallback for unknown status
  if (!config) {
    console.warn(`Unknown status: ${status}`);
    return (
      <Badge variant="secondary" className={cn('gap-1.5', className)}>
        {showDot && <Circle className="h-2 w-2 fill-current text-gray-500" />}
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} className={cn('gap-1.5', className)}>
      {showDot && <Circle className={cn('h-2 w-2 fill-current', config.color)} />}
      {config.label}
    </Badge>
  );
}
