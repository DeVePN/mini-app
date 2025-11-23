'use client';

import { useState, useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { AppLayout } from '@/components/navigation/AppLayout';
import { EnhancedNodeCard } from '@/components/cards/EnhancedNodeCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/lib/mock-api';
import { VPNNode } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart } from 'lucide-react';

export default function FavoritesPage() {
  const router = useRouter();
  const walletAddress = useTonAddress();
  const [favorites, setFavorites] = useState<VPNNode[]>([]);
  const [balance, setBalance] = useState({ ton: 0, usd: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [walletAddress]);

  const loadFavorites = async () => {
    try {
      if (walletAddress) {
        // Only load data if wallet is connected
        const [nodes, walletBalance] = await Promise.all([
          mockApi.getNodes(),
          mockApi.getWalletBalance(),
        ]);
        // Filter only favorites
        const favoriteNodes = nodes.data.filter(node => node.isFavorite);
        setFavorites(favoriteNodes);
        setBalance(walletBalance);
      } else {
        // Set empty state when no wallet
        setFavorites([]);
        setBalance({ ton: 0, usd: 0 });
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (nodeId: string) => {
    router.push(`/connect/${nodeId}`);
  };

  const handleToggleFavorite = (nodeId: string, isFavorite: boolean) => {
    setFavorites(prev =>
      isFavorite
        ? prev
        : prev.filter(node => node.id !== nodeId)
    );
  };

  return (
    <AppLayout balance={balance}>
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Favorite Nodes</h1>
            <p className="text-sm text-muted-foreground">
              Quick access to your bookmarked VPN nodes
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 animate-pulse bg-muted" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {walletAddress ? 'No Favorite Nodes Yet' : 'No Favorites'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {walletAddress
                ? 'Save your preferred nodes for quick access'
                : 'Connect your wallet to view favorite nodes'}
            </p>
            <Link href="/nodes">
              <Button>Browse Nodes</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((node) => (
              <EnhancedNodeCard
                key={node.id}
                node={node}
                onConnect={handleConnect}
                onToggleFavorite={handleToggleFavorite}
                variant="grid"
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
