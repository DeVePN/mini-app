'use client';

import { Bell, Settings, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HamburgerMenu } from './HamburgerMenu';

interface TopBarProps {
  title?: string;
  showWallet?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  balance?: {
    ton: number;
    usd: number;
  };
  notificationCount?: number;
}

export function TopBar({
  title = 'DeVPN',
  showWallet = true,
  showNotifications = true,
  showSettings = true,
  balance,
  notificationCount = 0,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <HamburgerMenu />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold">
              D
            </div>
            <h1 className="text-lg font-bold hidden sm:block">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showWallet && balance && (
            <Link href="/wallet">
              <Button variant="outline" size="sm" className="gap-2">
                <Wallet className="h-4 w-4" />
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs font-semibold">{balance.ton.toFixed(2)} TON</span>
                  <span className="text-[10px] text-muted-foreground">${balance.usd.toFixed(2)}</span>
                </div>
              </Button>
            </Link>
          )}

          {showNotifications && (
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {showSettings && (
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
