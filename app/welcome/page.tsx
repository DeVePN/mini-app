'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Users, Zap, Globe, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  const features = [
    {
      icon: Shield,
      title: 'Decentralized & Secure',
      description: 'No central authority. Your privacy is protected by blockchain technology.',
    },
    {
      icon: Users,
      title: 'Peer-to-Peer Network',
      description: 'Connect directly to community-run VPN nodes around the world.',
    },
    {
      icon: Zap,
      title: 'Pay-as-you-go',
      description: 'Only pay for what you use with transparent pricing on TON blockchain.',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Connect Wallet',
      description: 'Link your TON wallet to get started',
    },
    {
      step: 2,
      title: 'Choose a Node',
      description: 'Browse and select from global VPN nodes',
    },
    {
      step: 3,
      title: 'Start Browsing',
      description: 'Connect and browse securely',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-green-600 text-white mb-4">
            <Globe className="h-12 w-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-600">
            Welcome to DeVPN
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The world's first truly decentralized VPN powered by TON blockchain
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* How it Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">How it Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                <Card className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/connect" className="flex-1 sm:flex-none">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/nodes" className="flex-1 sm:flex-none">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Browse Nodes
            </Button>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>
            Built on{' '}
            <span className="font-semibold text-foreground">TON Blockchain</span>
            {' • '}
            Secured with{' '}
            <span className="font-semibold text-foreground">WireGuard</span>
          </p>
        </div>
      </div>
    </div>
  );
}
