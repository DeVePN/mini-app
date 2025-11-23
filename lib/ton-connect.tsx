'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';

const manifestUrl = process.env.NEXT_PUBLIC_MANIFEST_URL ||
  (typeof window !== 'undefined' ? `${window.location.origin}/tonconnect-manifest.json` : '');

// Telegram Mini App return URL
const telegramBotUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'devpn_bot';
const twaReturnUrl = `https://t.me/${telegramBotUsername}`;

export function TonConnectProvider({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      actionsConfiguration={{
        twaReturnUrl: twaReturnUrl as `${string}://${string}`,
      }}
    >
      {children}
    </TonConnectUIProvider>
  );
}
