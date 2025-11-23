'use client';

import { AppLayout } from '@/components/navigation/AppLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle, Book, Video } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I connect my TON wallet?',
        a: 'Click on the "Connect Wallet" button in the top right corner and follow the prompts to connect your TON wallet using TON Connect.',
      },
      {
        q: 'How do I choose a VPN node?',
        a: 'Go to the Browse Nodes page, filter by your preferences (location, price, speed), and click "Connect" on your chosen node.',
      },
      {
        q: 'What is a payment channel?',
        a: 'A payment channel is a smart contract that locks funds for your VPN session, enabling fast micropayments without blockchain fees for each second of usage.',
      },
    ],
  },
  {
    category: 'Connecting to Nodes',
    questions: [
      {
        q: 'How long does it take to connect?',
        a: 'Connection typically takes 10-30 seconds, including payment channel setup and WireGuard configuration generation.',
      },
      {
        q: 'Can I disconnect anytime?',
        a: 'Yes! You can disconnect at any time. Unused funds in your payment channel will be refunded automatically.',
      },
      {
        q: 'What if connection fails?',
        a: 'If connection fails, your payment channel will be automatically closed and funds returned. Try choosing a different node.',
      },
    ],
  },
  {
    category: 'Payments & Wallet',
    questions: [
      {
        q: 'How is pricing calculated?',
        a: 'Pricing is per hour of usage. The exact cost depends on the node provider&apos;s rate. You only pay for actual time connected.',
      },
      {
        q: 'What happens to unused funds?',
        a: 'When you disconnect, any unused funds in the payment channel are automatically refunded to your wallet.',
      },
      {
        q: 'Are there any additional fees?',
        a: 'Only standard TON blockchain transaction fees when opening/closing payment channels. No hidden fees.',
      },
    ],
  },
  {
    category: 'Becoming a Provider',
    questions: [
      {
        q: 'What do I need to become a provider?',
        a: 'You need a Linux server or VPS with a static IP, stable internet (min 100 Mbps), and a TON wallet with minimum stake.',
      },
      {
        q: 'How much can I earn?',
        a: 'Earnings depend on your pricing, uptime, and demand. Use the earnings calculator on the provider page for estimates.',
      },
      {
        q: 'Is there a minimum stake required?',
        a: 'Yes, a minimum stake of 50 TON is required as security deposit to operate a node.',
      },
    ],
  },
  {
    category: 'Troubleshooting',
    questions: [
      {
        q: 'VPN connection is slow',
        a: 'Try connecting to a different node closer to your location. Check node ratings and current load in the node details.',
      },
      {
        q: 'Cannot see my transactions',
        a: 'Transactions may take a few minutes to appear. Check your wallet address and ensure you&apos;re on the correct network (testnet/mainnet).',
      },
      {
        q: 'Balance not updating',
        a: 'Refresh the page. If issue persists, check the TON blockchain explorer with your wallet address.',
      },
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Help & Support</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions and get support
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Book className="h-10 w-10 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Documentation</h3>
            <p className="text-sm text-muted-foreground">
              Read our complete guides
            </p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Video className="h-10 w-10 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Video Tutorials</h3>
            <p className="text-sm text-muted-foreground">
              Watch step-by-step guides
            </p>
          </Card>
          <Link href="https://t.me/devpn_support" target="_blank">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <MessageCircle className="h-10 w-10 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Community Support</h3>
              <p className="text-sm text-muted-foreground">
                Join our Telegram group
              </p>
            </Card>
          </Link>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          {filteredFAQs.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No results found for &quot;{searchQuery}&quot;</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredFAQs.map((category, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{category.category}</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, qIdx) => (
                      <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-left">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <Card className="p-8 text-center bg-green-50 dark:bg-green-950">
          <h3 className="text-xl font-bold mb-2">Still need help?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is here to assist you
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="https://t.me/devpn_support" target="_blank">
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline">
                About DeVPN
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
