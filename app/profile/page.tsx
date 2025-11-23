'use client';

import { useState, useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { AppLayout } from '@/components/navigation/AppLayout';
import { MetricCard } from '@/components/data-display/MetricCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockApi } from '@/lib/mock-api';
import { UserProfile } from '@/types';
import Link from 'next/link';
import { Settings, Heart, Clock, Database, Trophy, User } from 'lucide-react';

export default function ProfilePage() {
  const walletAddress = useTonAddress();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState({ ton: 0, usd: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [walletAddress]);

  const loadProfile = async () => {
    try {
      if (walletAddress) {
        // Only load data if wallet is connected
        const [userProfile, walletBalance] = await Promise.all([
          mockApi.getUserProfile(),
          mockApi.getWalletBalance(),
        ]);

        setProfile(userProfile);
        setBalance(walletBalance);
      } else {
        // Set empty profile state when no wallet
        setProfile({
          id: '',
          telegramId: 0,
          username: '',
          firstName: '',
          lastName: '',
          accountType: 'consumer',
          memberSince: new Date().toISOString(),
          statistics: {
            consumer: {
              totalSessions: 0,
              totalDuration: 0,
              totalDataUsed: 0,
              totalSpent: 0
            }
          },
          preferences: {} as any,
          achievements: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setBalance({ ton: 0, usd: 0 });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <AppLayout balance={balance}>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="h-24 bg-muted rounded-lg" />
              <div className="h-24 bg-muted rounded-lg" />
              <div className="h-24 bg-muted rounded-lg" />
              <div className="h-24 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const stats = profile.statistics.consumer;

  return (
    <AppLayout balance={balance}>
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className={`text-2xl ${walletAddress ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                {walletAddress && profile.firstName ? profile.firstName.charAt(0) : <User className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">
                  {walletAddress && profile.firstName ? `${profile.firstName} ${profile.lastName}` : '—'}
                </h1>
                <Badge>Consumer</Badge>
              </div>
              <p className="text-muted-foreground">
                @{walletAddress && profile.username ? profile.username : '—'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {walletAddress ? `Member since ${new Date(profile.memberSince).toLocaleDateString()}` : 'Connect wallet to view profile'}
              </p>
            </div>
            <Link href="/profile/settings">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Sessions"
            value={stats?.totalSessions || 0}
            icon={Clock}
          />
          <MetricCard
            title="Data Used"
            value={`${stats?.totalDataUsed || 0} GB`}
            icon={Database}
          />
          <MetricCard
            title="Total Spent"
            value={`${stats?.totalSpent || 0} TON`}
            icon={Trophy}
          />
          <MetricCard
            title="Favorites"
            value="5"
            icon={Heart}
          />
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-xl font-bold mb-4">Achievements</h2>
          {walletAddress && profile.achievements.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {profile.achievements.map((achievement) => (
                <Card key={achievement.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {walletAddress ? 'No achievements yet' : 'Connect your wallet to view achievements'}
              </p>
            </Card>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/profile/favorites">
            <Button variant="outline" className="w-full justify-start">
              <Heart className="h-4 w-4 mr-2" />
              Favorite Nodes
            </Button>
          </Link>
          <Link href="/profile/settings">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
