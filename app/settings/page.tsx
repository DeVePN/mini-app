'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/navigation/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { mockApi } from '@/lib/mock-api';
import Link from 'next/link';
import {
  Zap, Bell, Palette, Globe, Shield, Database,
  Info, HelpCircle, FileText
} from 'lucide-react';

export default function SettingsPage() {
  const [balance, setBalance] = useState({ ton: 0, usd: 0 });
  const [settings, setSettings] = useState({
    autoConnect: false,
    autoReconnect: true,
    killSwitch: true,
    notifications: true,
    theme: 'auto' as 'light' | 'dark' | 'auto',
    language: 'en',
    network: 'testnet' as 'testnet' | 'mainnet',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const walletBalance = await mockApi.getWalletBalance();
      setBalance(walletBalance);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AppLayout balance={balance}>
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences</p>
        </div>

        {/* Connection Settings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Connection</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-connect on startup</p>
                <p className="text-sm text-muted-foreground">
                  Connect to last used node automatically
                </p>
              </div>
              <Switch
                checked={settings.autoConnect}
                onCheckedChange={(checked) => updateSetting('autoConnect', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-reconnect</p>
                <p className="text-sm text-muted-foreground">
                  Reconnect automatically if connection drops
                </p>
              </div>
              <Switch
                checked={settings.autoReconnect}
                onCheckedChange={(checked) => updateSetting('autoReconnect', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Kill switch</p>
                <p className="text-sm text-muted-foreground">
                  Block traffic if VPN disconnects
                </p>
              </div>
              <Switch
                checked={settings.killSwitch}
                onCheckedChange={(checked) => updateSetting('killSwitch', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable notifications</p>
              <p className="text-sm text-muted-foreground">
                Get updates about sessions and payments
              </p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>

          <div>
            <label className="font-medium mb-2 block">Theme</label>
            <Select value={settings.theme} onValueChange={(value: any) => updateSetting('theme', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="font-medium mb-2 block">Language</label>
            <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Advanced */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Advanced</h2>
          </div>

          <div>
            <label className="font-medium mb-2 block">Network</label>
            <Select value={settings.network} onValueChange={(value: any) => updateSetting('network', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="testnet">Testnet</SelectItem>
                <SelectItem value="mainnet">Mainnet</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              Currently connected to TON {settings.network}
            </p>
          </div>
        </Card>

        {/* Support & Info */}
        <Card className="p-6 space-y-3">
          <Link href="/help">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & Support
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="w-full justify-start">
              <Info className="h-4 w-4 mr-2" />
              About DeVPN
            </Button>
          </Link>
          <Link href="/privacy">
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Privacy Policy
            </Button>
          </Link>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>DeVPN v1.0.0</p>
          <p>Built on TON Blockchain</p>
        </div>
      </div>
    </AppLayout>
  );
}
