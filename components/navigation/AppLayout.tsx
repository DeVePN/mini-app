'use client';

import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showWallet?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  showBottomNav?: boolean;
  balance?: {
    ton: number;
    usd: number;
  };
  notificationCount?: number;
}

export function AppLayout({
  children,
  title,
  showWallet = true,
  showNotifications = true,
  showSettings = true,
  showBottomNav = true,
  balance,
  notificationCount,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        title={title}
        showWallet={showWallet}
        showNotifications={showNotifications}
        showSettings={showSettings}
        balance={balance}
        notificationCount={notificationCount}
      />

      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}
