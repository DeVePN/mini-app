'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';

const manifestUrl = process.env.NEXT_PUBLIC_MANIFEST_URL ||
  (typeof window !== 'undefined' ? `${window.location.origin}/tonconnect-manifest.json` : '');

export function TonConnectProvider({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
