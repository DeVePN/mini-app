'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { Globe, ArrowUpDown, Clock, Zap } from 'lucide-react';
import { VPNSession } from '@/types';
import Link from 'next/link';

interface ConnectionStatusCardProps {
  session?: VPNSession | null;
  onDisconnect?: () => void;
  onQuickConnect?: () => void;
}

export function ConnectionStatusCard({ session, onDisconnect, onQuickConnect }: ConnectionStatusCardProps) {
  if (!session) {
    return (
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />

        <div className="relative text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-muted">
            <Globe className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Not Connected</h3>
            <p className="text-sm text-muted-foreground">
              Connect to a VPN node to browse securely
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Link href="/nodes">
              <Button>Browse Nodes</Button>
            </Link>
            {onQuickConnect && (
              <Button variant="outline" onClick={onQuickConnect}>
                Quick Connect
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatData = (mb: number) => {
    if (mb >= 1000) return `${(mb / 1000).toFixed(2)} GB`;
    return `${mb.toFixed(0)} MB`;
  };

  return (
    <Card className="p-6 relative overflow-hidden border-2 border-green-500/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-500/10">
              <Globe className="h-6 w-6 text-green-600 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold">Connected</h3>
                <StatusBadge status="active" />
              </div>
              <p className="text-sm text-muted-foreground">
                {session.nodeName} • {session.nodeLocation.city}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-semibold">{formatDuration(session.duration)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Data Used</p>
              <p className="text-sm font-semibold">{formatData(session.metrics.current.totalData)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Download</p>
              <p className="text-sm font-semibold text-green-600">
                {session.metrics.current.downloadSpeed.toFixed(1)} Mbps
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Upload</p>
              <p className="text-sm font-semibold text-green-600">
                {session.metrics.current.uploadSpeed.toFixed(1)} Mbps
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex gap-2">
          <Link href={`/session/${session.id}`} className="flex-1">
            <Button variant="outline" className="w-full">View Details</Button>
          </Link>
          {onDisconnect && (
            <Button variant="destructive" onClick={onDisconnect}>
              Disconnect
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
