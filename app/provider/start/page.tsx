'use client';

import { AppLayout } from '@/components/navigation/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RequireWallet } from '@/components/RequireWallet';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, DollarSign, Shield, Users, TrendingUp, Server } from 'lucide-react';

export default function ProviderStartPage() {
  const [bandwidth, setBandwidth] = useState([100]);
  const [hoursOnline, setHoursOnline] = useState([12]);
  const [price, setPrice] = useState([0.05]);

  const dailyEarnings = (bandwidth[0] / 100) * hoursOnline[0] * price[0] * 10;
  const monthlyEarnings = dailyEarnings * 30;

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-2">
            <Server className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Become a Provider</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Earn passive income by sharing your internet connection as a VPN node
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <DollarSign className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold mb-2">Passive Income</h3>
            <p className="text-sm text-muted-foreground">
              Earn TON tokens automatically while your node runs in the background
            </p>
          </Card>
          <Card className="p-6">
            <Shield className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold mb-2">Decentralized Network</h3>
            <p className="text-sm text-muted-foreground">
              Help build a truly decentralized VPN network owned by the community
            </p>
          </Card>
          <Card className="p-6">
            <Users className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold mb-2">Flexible Pricing</h3>
            <p className="text-sm text-muted-foreground">
              Set your own prices and capacity limits based on your preferences
            </p>
          </Card>
          <Card className="p-6">
            <TrendingUp className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold mb-2">Growing Demand</h3>
            <p className="text-sm text-muted-foreground">
              Join early and benefit from increasing demand for decentralized VPNs
            </p>
          </Card>
        </div>

        {/* Requirements */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Requirements</h2>
          <div className="space-y-3">
            {[
              'Stable internet connection (minimum 100 Mbps)',
              'Linux server or VPS with static IP',
              'TON wallet with minimum stake (50 TON)',
              'Port forwarding capability',
              'Basic technical knowledge',
            ].map((req, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span className="text-sm">{req}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Earnings Calculator */}
        <Card className="p-6 bg-green-50 dark:bg-green-950">
          <h2 className="text-xl font-bold mb-6">Earnings Calculator</h2>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Bandwidth: {bandwidth[0]} Mbps
              </label>
              <Slider
                value={bandwidth}
                onValueChange={setBandwidth}
                min={50}
                max={1000}
                step={50}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Hours Online: {hoursOnline[0]}h/day
              </label>
              <Slider
                value={hoursOnline}
                onValueChange={setHoursOnline}
                min={1}
                max={24}
                step={1}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Price: {price[0].toFixed(2)} TON/hour
              </label>
              <Slider
                value={price}
                onValueChange={setPrice}
                min={0.01}
                max={0.2}
                step={0.01}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Daily Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  {dailyEarnings.toFixed(2)} TON
                </p>
                <p className="text-xs text-muted-foreground">
                  ≈ ${(dailyEarnings * 5).toFixed(2)} USD
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  {monthlyEarnings.toFixed(2)} TON
                </p>
                <p className="text-xs text-muted-foreground">
                  ≈ ${(monthlyEarnings * 5).toFixed(2)} USD
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <RequireWallet
            modalTitle="Connect Wallet to Become a Provider"
            modalDescription="You need to connect your TON wallet to register as a VPN provider and receive earnings."
          >
            <Link href="/provider/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Setup
              </Button>
            </Link>
          </RequireWallet>
          <Link href="/help/provider">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Info Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Estimated setup time: ~30 minutes</p>
          <p className="mt-1">Need help? Join our community support</p>
        </div>
      </div>
    </AppLayout>
  );
}
