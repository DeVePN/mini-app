import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Clock, ArrowUpDown, Timer } from 'lucide-react';
import { VPNSession } from '@/types';
import Link from 'next/link';

interface SessionCardProps {
  session: VPNSession;
  onDisconnect?: (sessionId: string) => void;
  variant?: 'active' | 'history';
}

export function SessionCard({ session, onDisconnect, variant = 'active' }: SessionCardProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatData = (mb: number) => {
    if (mb >= 1000) {
      return `${(mb / 1000).toFixed(2)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getFlagEmoji(session.nodeLocation.countryCode)}</span>
          <div>
            <Link href={`/session/${session.id}`} className="font-semibold hover:underline">
              {session.nodeName}
            </Link>
            <p className="text-xs text-muted-foreground">{session.nodeLocation.city}</p>
          </div>
        </div>
        <StatusBadge status={session.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <p className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Duration
          </p>
          <p className="font-medium">{formatDuration(session.duration)}</p>
        </div>
        <div>
          <p className="text-muted-foreground flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3" />
            Data Used
          </p>
          <p className="font-medium">{formatData(session.metrics.current.totalData)}</p>
        </div>
        {variant === 'active' && (
          <>
            <div>
              <p className="text-muted-foreground">Upload</p>
              <p className="font-medium">{session.metrics.current.uploadSpeed.toFixed(1)} Mbps</p>
            </div>
            <div>
              <p className="text-muted-foreground">Download</p>
              <p className="font-medium">{session.metrics.current.downloadSpeed.toFixed(1)} Mbps</p>
            </div>
          </>
        )}
        <div>
          <p className="text-muted-foreground">Cost</p>
          <p className="font-medium">{session.totalCost.toFixed(4)} TON</p>
        </div>
        {variant === 'active' ? (
          <div>
            <p className="text-muted-foreground flex items-center gap-1">
              <Timer className="h-3 w-3" />
              Remaining
            </p>
            <p className="font-medium">{formatDuration(session.estimatedTimeLeft)}</p>
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">{new Date(session.startTime).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Link href={`/session/${session.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        {variant === 'active' && onDisconnect && (
          <Button variant="destructive" onClick={() => onDisconnect(session.id)}>
            Disconnect
          </Button>
        )}
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
