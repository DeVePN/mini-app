'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Menu,
  Home,
  Globe,
  Wallet,
  Clock,
  User,
  Settings,
  Heart,
  Server,
  HelpCircle,
  Info,
  Layers,
  TrendingUp,
  CreditCard,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  description?: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Main',
    items: [
      { title: 'Dashboard', href: '/', icon: Home, description: 'Overview & stats' },
      { title: 'Browse Nodes', href: '/nodes', icon: Globe, description: 'Find VPN nodes' },
      { title: 'My Sessions', href: '/sessions', icon: Clock, description: 'Active & history' },
      { title: 'Wallet', href: '/wallet', icon: Wallet, description: 'Balance & payments' },
    ],
  },
  {
    title: 'Wallet',
    items: [
      { title: 'Top Up', href: '/wallet/topup', icon: TrendingUp, description: 'Add funds' },
      { title: 'Payment Channels', href: '/wallet/channels', icon: Layers, description: 'Manage channels' },
      { title: 'Transactions', href: '/wallet/transactions', icon: CreditCard, description: 'History' },
    ],
  },
  {
    title: 'Profile',
    items: [
      { title: 'My Profile', href: '/profile', icon: User, description: 'Account info' },
      { title: 'Favorites', href: '/profile/favorites', icon: Heart, description: 'Saved nodes' },
      { title: 'Settings', href: '/settings', icon: Settings, description: 'Preferences' },
    ],
  },
  {
    title: 'Provider',
    items: [
      { title: 'Become Provider', href: '/provider/start', icon: Server, description: 'Earn by sharing', badge: 'New' },
    ],
  },
  {
    title: 'Support',
    items: [
      { title: 'Help & FAQ', href: '/help', icon: HelpCircle, description: 'Get support' },
      { title: 'About DeVPN', href: '/about', icon: Info, description: 'Learn more' },
    ],
  },
];

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold">
              D
            </div>
            <span>DeVPN Menu</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn('font-medium text-sm', isActive ? 'text-primary-foreground' : '')}>
                            {item.title}
                          </p>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className={cn('text-xs', isActive ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                            {item.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className={cn('h-4 w-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                    </Link>
                  );
                })}
              </div>
              {idx < menuSections.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-8 px-3 py-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            DeVPN v1.0.0 Beta
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Built on TON Blockchain
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
