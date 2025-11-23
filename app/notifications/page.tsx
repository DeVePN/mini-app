'use client';

import { AppLayout } from '@/components/navigation/AppLayout';
import { Card } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { useWalletBalance } from '@/hooks/use-wallet-balance';

export default function NotificationsPage() {
    const { data: walletBalance } = useWalletBalance();

    const balance = {
        ton: walletBalance?.ton || 0,
        usd: (walletBalance?.ton || 0) * 5
    };

    return (
        <AppLayout balance={balance} title="Notifications">
            <div className="container max-w-2xl mx-auto px-4 py-6">
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="bg-muted p-4 rounded-full">
                        <Bell className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold">No new notifications</h2>
                    <p className="text-muted-foreground max-w-sm">
                        You're all caught up! We'll notify you when there are important updates about your VPN sessions or wallet.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
