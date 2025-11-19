'use client';

import { AppLayout } from '@/components/navigation/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Globe, Zap, Users, Github, Twitter, Send } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-green-600 text-white mb-4">
            <Globe className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold">About DeVPN</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The world's first truly decentralized VPN network powered by TON blockchain
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Version 1.0.0 Beta
          </Badge>
        </div>

        {/* Mission */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            DeVPN is building the future of internet privacy through decentralization.
            We believe that VPN services should be owned by the community, not controlled
            by centralized corporations. By leveraging blockchain technology and peer-to-peer
            networking, we're creating a VPN network that is truly private, censorship-resistant,
            and community-driven.
          </p>
        </Card>

        {/* Key Features */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Why DeVPN?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <Shield className="h-10 w-10 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">True Decentralization</h3>
              <p className="text-sm text-muted-foreground">
                No central authority controls the network. Nodes are operated by
                community members worldwide.
              </p>
            </Card>
            <Card className="p-6">
              <Globe className="h-10 w-10 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Global Network</h3>
              <p className="text-sm text-muted-foreground">
                Connect to VPN nodes across the globe, operated by providers in
                different countries.
              </p>
            </Card>
            <Card className="p-6">
              <Zap className="h-10 w-10 text-yellow-600 mb-3" />
              <h3 className="font-semibold mb-2">Pay-as-you-go</h3>
              <p className="text-sm text-muted-foreground">
                Only pay for what you use with transparent, blockchain-verified
                micropayments.
              </p>
            </Card>
            <Card className="p-6">
              <Users className="h-10 w-10 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Earn as Provider</h3>
              <p className="text-sm text-muted-foreground">
                Anyone can become a node provider and earn passive income by
                sharing bandwidth.
              </p>
            </Card>
          </div>
        </div>

        {/* Technology Stack */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Technology</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">TON Blockchain</h3>
              <p className="text-sm text-muted-foreground">
                Built on The Open Network (TON) for fast, secure, and scalable
                transactions. Smart contracts handle payments and node registration.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">WireGuard Protocol</h3>
              <p className="text-sm text-muted-foreground">
                Uses the modern WireGuard VPN protocol for superior speed and
                security compared to traditional VPN protocols.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Channels</h3>
              <p className="text-sm text-muted-foreground">
                Lightning-fast micropayments enabled by blockchain payment channels,
                eliminating the need for per-second transactions.
              </p>
            </div>
          </div>
        </Card>

        {/* Smart Contracts */}
        <Card className="p-8 bg-muted">
          <h2 className="text-2xl font-bold mb-4">Smart Contracts</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Node Registry:</span>
              <Link
                href="https://testnet.tonscan.org"
                target="_blank"
                className="text-green-600 hover:underline"
              >
                EQC...abc123
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Channel:</span>
              <Link
                href="https://testnet.tonscan.org"
                target="_blank"
                className="text-green-600 hover:underline"
              >
                EQD...def456
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network:</span>
              <Badge variant="outline">TON Testnet</Badge>
            </div>
          </div>
        </Card>

        {/* Community */}
        <Card className="p-8 text-center bg-green-50 dark:bg-green-950">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-6">
            Connect with other DeVPN users and stay updated
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="https://t.me/devpn" target="_blank">
              <Button variant="outline" className="gap-2">
                <Send className="h-4 w-4" />
                Telegram
              </Button>
            </Link>
            <Link href="https://twitter.com/devpn" target="_blank">
              <Button variant="outline" className="gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
            </Link>
            <Link href="https://github.com/devpn" target="_blank">
              <Button variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            {' • '}
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            {' • '}
            <Link href="/help" className="hover:underline">Help Center</Link>
          </p>
          <p>© 2024 DeVPN. Open source and community-driven.</p>
          <p>Licensed under MIT License</p>
        </div>
      </div>
    </AppLayout>
  );
}
