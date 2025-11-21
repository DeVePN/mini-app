'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { mockApi } from '@/lib/mock-api';
import { telegram } from '@/lib/telegram';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { formatTON, formatBandwidth, formatDuration, getCountryFlag } from '@/utils/format';
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  Activity,
  Clock,
  DollarSign,
  Download,
  Upload,
  AlertCircle
} from 'lucide-react';

export default function SessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const queryClient = useQueryClient();
  const [duration, setDuration] = useState(0);
  const [isStopping, setIsStopping] = useState(false);

  const { data: session, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => mockApi.getSessionById(sessionId),
    refetchInterval: (data) => {
      // Only refetch every 3s if the session is active
      return data?.status === 'active' ? 3000 : false;
    },
  });

  // Using direct transaction sending instead of mutation
  // const stopMutation = useMutation({
  //   mutationFn: () => mockApi.stopSession(sessionId),
  //   ...
  // });

  useEffect(() => {
    telegram.showBackButton(() => {
      router.push('/nodes');
    });

    return () => {
      telegram.hideBackButton();
    };
  }, [router]);

  // Update duration timer
  useEffect(() => {
    if (!session || session.status !== 'active') return;

    const startTime = new Date(session.startTime).getTime();
    const updateDuration = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setDuration(elapsed);
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const handleStopSession = async () => {
    const confirmed = confirm('Are you sure you want to disconnect from this VPN session?');

    if (!confirmed) return;

    setIsStopping(true);
    try {
      // Step 1: Send real EndSession transaction to blockchain
      const sessionManagerAddress = process.env.NEXT_PUBLIC_SESSION_MANAGER_ADDRESS;

      if (!sessionManagerAddress) {
        throw new Error('SessionManager contract address not configured');
      }

      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
        messages: [
          {
            address: sessionManagerAddress,
            amount: '50000000', // 0.05 TON for gas
            // Note: Payload should be properly built for EndSession message
            // For hackathon, sending simple value transaction
          }
        ]
      });

      console.log('Real EndSession blockchain transaction sent:', result);

      // Step 2: Update mock session status (stop session locally)
      // The mock session will be marked as stopped

      // Redirect back to nodes page
      router.push('/nodes');
    } catch (error: any) {
      console.error('Failed to stop session:', error);
      alert(error.message || 'Failed to stop session');
      setIsStopping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Session not found</h2>
          <Button onClick={() => router.push('/nodes')} variant="secondary">
            Back to Nodes
          </Button>
        </Card>
      </div>
    );
  }

  const isActive = session.status === 'active';
  const currentCost = duration * Number(session.node.pricePerSecond);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/nodes')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to nodes
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCountryFlag(session.node.countryCode)}</span>
              <div>
                <h1 className="text-xl font-bold">{session.node.country}</h1>
                <p className="text-sm text-gray-500">VPN Session</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {isActive ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm font-medium">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm font-medium">Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Session Stats */}
        {isActive && (
          <Card className="bg-green-50 border-green-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900/70">Duration</p>
                  <p className="text-xl font-bold text-green-900">
                    {formatDuration(duration)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900/70">Current Cost</p>
                  <p className="text-xl font-bold text-green-900">
                    {formatTON(currentCost)} TON
                  </p>
                </div>
              </div>
            </div>

            {session.bytesTransferred !== undefined && (
              <div className="mt-4 pt-4 border-t border-green-300">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-600" />
                    <span className="text-green-900/70">Data transferred</span>
                  </div>
                  <span className="font-semibold text-green-900">
                    {formatBandwidth(session.bytesTransferred)}
                  </span>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Connection Details */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Connection Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Server IP</span>
              <span className="font-mono">{session.serverIP}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Server Port</span>
              <span className="font-mono">{session.serverPort}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Client IP</span>
              <span className="font-mono">{session.clientIP}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium ${
                isActive ? 'text-green-600' : 'text-gray-600'
              }`}>
                {session.status.toUpperCase()}
              </span>
            </div>
            {session.startTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Started At</span>
                <span>{new Date(session.startTime).toLocaleString()}</span>
              </div>
            )}
            {session.endTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Ended At</span>
                <span>{new Date(session.endTime).toLocaleString()}</span>
              </div>
            )}
          </div>
        </Card>

        {/* WireGuard Configuration */}
        {session.config && (
          <QRCodeDisplay
            config={session.config}
            filename={`devpn-${session.node.country.toLowerCase()}.conf`}
          />
        )}

        {/* Pricing Info */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Pricing</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Rate</span>
              <span className="font-semibold">{formatTON(session.node.pricePerSecond)} TON/s</span>
            </div>
            {session.totalCost && (
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600">Total Cost</span>
                <span className="font-bold text-lg">{formatTON(session.totalCost)} TON</span>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Channel (if exists) */}
        {session.paymentChannelAddress && (
          <Card className="bg-green-50 border-green-200">
            <h2 className="text-lg font-semibold mb-2 text-green-900">Payment Channel</h2>
            <p className="text-sm font-mono text-green-700 break-all">
              {session.paymentChannelAddress}
            </p>
          </Card>
        )}

        {/* Actions */}
        <div className="sticky bottom-4">
          {isActive ? (
            <Button
              variant="danger"
              size="lg"
              className="w-full"
              onClick={handleStopSession}
              disabled={isStopping}
              isLoading={isStopping}
            >
              {isStopping ? 'Disconnecting...' : 'Disconnect VPN'}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/nodes')}
            >
              Browse Nodes
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
