'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';

const manifestUrl = 'https://mini-app-e694.vercel.app/tonconnect-manifest.json';

// Telegram Mini App return URL
const telegramBotUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'devpn_bot';
const twaReturnUrl = `https://t.me/${telegramBotUsername}/app`;

if (typeof window !== 'undefined') {
  console.log('TonConnect Config:', { manifestUrl, twaReturnUrl });
}

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
