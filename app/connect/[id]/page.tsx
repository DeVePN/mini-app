'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { AppLayout } from '@/components/navigation/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { mockApi } from '@/lib/mock-api';
import { VPNNode } from '@/types';
import Link from 'next/link';
import {
  ArrowLeft,
  Globe,
  DollarSign,
  Clock,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Wallet
} from 'lucide-react';

export default function ConnectToNodePage() {
  const router = useRouter();
  const params = useParams();
  const nodeId = params.id as string;
  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const [node, setNode] = useState<VPNNode | null>(null);
  const [balance, setBalance] = useState({ ton: 0, usd: 0 });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [depositAmount, setDepositAmount] = useState([10]);

  useEffect(() => {
    loadNodeDetails();
  }, [nodeId, walletAddress]);

  const loadNodeDetails = async () => {
    try {
      const nodeData = await mockApi.getNodeById(nodeId);
      setNode(nodeData);

      // Only load balance if wallet is connected
      if (walletAddress) {
        const walletBalance = await mockApi.getWalletBalance();
        setBalance(walletBalance);
      } else {
        setBalance({ ton: 0, usd: 0 });
      }
    } catch (error) {
      console.error('Failed to load node:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    // Check wallet connection first
    if (!walletAddress) {
      tonConnectUI.openModal();
      return;
    }

    if (!node) return;

    setConnecting(true);
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create mock session
      const session = await mockApi.createSession(nodeId, depositAmount[0]);

      // Redirect to session page
      router.push(`/session/${session.id}`);
    } catch (error) {
      console.error('Connection failed:', error);
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout balance={balance}>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-48 bg-muted rounded-lg" />
            <div className="h-64 bg-muted rounded-lg" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!node) {
    return (
      <AppLayout balance={balance}>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Node Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The node you&apos;re trying to connect to doesn&apos;t exist.
            </p>
            <Link href="/nodes">
              <Button>Browse Nodes</Button>
            </Link>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const estimatedHours = depositAmount[0] / node.pricing.pricePerHour;

  return (
    <AppLayout balance={balance}>
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/nodes/${nodeId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Connect to Node</h1>
            <p className="text-sm text-muted-foreground">
              Set up your VPN connection
            </p>
          </div>
        </div>

        {/* Node Info Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{node.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {node.location.city}, {node.location.country}
                </p>
              </div>
            </div>
            <StatusBadge status={node.status} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Speed</p>
              <Badge variant="outline" className="capitalize">{node.speedTier}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Rating</p>
              <p className="font-semibold">⭐ {node.rating.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Active Users</p>
              <p className="font-semibold">{node.activeUsers}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Uptime</p>
              <p className="font-semibold">{node.statistics.uptime}%</p>
            </div>
          </div>
        </Card>

        {/* Payment Setup */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-bold">Payment Setup</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">
                  Deposit Amount
                </label>
                <span className="text-2xl font-bold text-green-600">
                  {depositAmount[0].toFixed(2)} TON
                </span>
              </div>
              <Slider
                value={depositAmount}
                onValueChange={setDepositAmount}
                min={1}
                max={100}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">
                Minimum: 1 TON • Your balance: {balance.ton.toFixed(2)} TON
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Price per Hour</p>
                <p className="font-semibold">{node.pricing.pricePerHour.toFixed(3)} TON</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Estimated Runtime</p>
                <p className="font-semibold">~{estimatedHours.toFixed(1)} hours</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Deposit Required</p>
                <p className="font-semibold">{node.pricing.depositRequired.toFixed(2)} TON</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Available After</p>
                <p className="font-semibold text-green-600">
                  {(depositAmount[0] - node.pricing.depositRequired).toFixed(2)} TON
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Connection Details */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-bold">Connection Details</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Payment Channel</p>
                <p className="text-sm text-muted-foreground">
                  A smart contract will be created to handle micropayments
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">WireGuard Configuration</p>
                <p className="text-sm text-muted-foreground">
                  Secure VPN tunnel using modern WireGuard protocol
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Automatic Refund</p>
                <p className="text-sm text-muted-foreground">
                  Unused funds will be returned when you disconnect
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">Real-time Metering</p>
                <p className="text-sm text-muted-foreground">
                  Pay only for actual usage, charged per second
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Important Notice */}
        <Card className="p-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200">
          <div className="flex gap-3">
            <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-sm mb-1">Important Notice</p>
              <p className="text-sm text-muted-foreground">
                Connection setup may take 30-60 seconds. Please don&apos;t close this window during setup.
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link href={`/nodes/${nodeId}`} className="flex-1">
            <Button variant="outline" className="w-full" disabled={connecting}>
              Cancel
            </Button>
          </Link>
          <Button
            className="flex-1"
            onClick={handleConnect}
            disabled={connecting || (!!walletAddress && (depositAmount[0] > balance.ton || depositAmount[0] < node.pricing.depositRequired))}
          >
            {connecting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Connecting...
              </>
            ) : !walletAddress ? (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </>
            ) : (
              'Start Connection'
            )}
          </Button>
        </div>

        {depositAmount[0] > balance.ton && (
          <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200">
            <p className="text-sm text-red-600 dark:text-red-400">
              Insufficient balance. Please top up your wallet first.
            </p>
          </Card>
        )}

        {depositAmount[0] < node.pricing.depositRequired && (
          <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200">
            <p className="text-sm text-red-600 dark:text-red-400">
              Minimum deposit required: {node.pricing.depositRequired.toFixed(2)} TON
            </p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
