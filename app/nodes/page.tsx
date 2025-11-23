'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTonAddress } from '@tonconnect/ui-react';
import { AppLayout } from '@/components/navigation/AppLayout';
import { EnhancedNodeCard } from '@/components/cards/EnhancedNodeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { VPNNode } from '@/types';
import { RefreshCw, Search, Filter, Grid, List, Map } from 'lucide-react';

export default function NodesPage() {
  const router = useRouter();
  const walletAddress = useTonAddress();
  const [nodes, setNodes] = useState<VPNNode[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<VPNNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState({ ton: 0, usd: 0 });

  // Filters and view state
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'speed' | 'rating'>('rating');
  const [priceRange, setPriceRange] = useState([0, 0.1]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [onlineOnly, setOnlineOnly] = useState(true);

  useEffect(() => {
    loadNodes();
    // Only load balance if wallet is connected
    if (walletAddress) {
      loadBalance();
    }
  }, [walletAddress]);

  useEffect(() => {
    filterAndSortNodes();
  }, [nodes, searchQuery, sortBy, priceRange, selectedCountries, onlineOnly]);

  const loadNodes = async () => {
    try {
      const nodes = await api.getNodes();
      setNodes(nodes);
    } catch (error) {
      console.error('Failed to load nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async () => {
    try {
      const walletBalance = await mockApi.getWalletBalance();
      setBalance(walletBalance);
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const filterAndSortNodes = () => {
    let filtered = [...nodes];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(node =>
        node.name.toLowerCase().includes(query) ||
        node.location.country.toLowerCase().includes(query) ||
        node.location.city.toLowerCase().includes(query)
      );
    }

    // Online only filter
    if (onlineOnly) {
      filtered = filtered.filter(node => node.status === 'online');
    }

    // Price range filter
    filtered = filtered.filter(node =>
      node.pricing.pricePerHour >= priceRange[0] &&
      node.pricing.pricePerHour <= priceRange[1]
    );

    // Country filter
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(node =>
        selectedCountries.includes(node.location.country)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricing.pricePerHour - b.pricing.pricePerHour;
        case 'speed':
          return b.statistics.averageSpeed - a.statistics.averageSpeed;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredNodes(filtered);
  };

  const handleConnect = (nodeId: string) => {
    router.push(`/connect/${nodeId}`);
  };

  const handleToggleFavorite = async (nodeId: string, isFavorite: boolean) => {
    // Update local state
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, isFavorite } : node
    ));
  };

  const handleRefresh = () => {
    setLoading(true);
    loadNodes();
  };

  const availableCountries = Array.from(new Set(nodes.map(n => n.location.country)));

  return (
    <AppLayout balance={balance} title="Browse Nodes">
      <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by country, city, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Best Rating</SelectItem>
                <SelectItem value="price">Lowest Price</SelectItem>
                <SelectItem value="speed">Fastest</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>

            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range (TON/hour)</label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={0.2}
                step={0.01}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{priceRange[0].toFixed(2)} TON</span>
                <span>{priceRange[1].toFixed(2)} TON</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Online Only</span>
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={(e) => setOnlineOnly(e.target.checked)}
                className="h-4 w-4"
              />
            </div>
          </Card>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Found {filteredNodes.length} node{filteredNodes.length !== 1 ? 's' : ''}
          </p>
          {selectedCountries.length > 0 && (
            <Button variant="link" size="sm" onClick={() => setSelectedCountries([])}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* Nodes Grid/List */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredNodes.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No nodes found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCountries([]);
              setOnlineOnly(false);
            }}>
              Clear All Filters
            </Button>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
            {filteredNodes.map((node) => (
              <EnhancedNodeCard
                key={node.id}
                node={node}
                onConnect={handleConnect}
                onToggleFavorite={handleToggleFavorite}
                variant={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
