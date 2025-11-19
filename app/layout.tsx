import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TonConnectProvider } from '@/lib/ton-connect';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'DeVPN - Decentralized VPN',
  description: 'Peer-to-peer VPN network powered by TON blockchain',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body>
        <TonConnectProvider>
          <Providers>
            {children}
          </Providers>
        </TonConnectProvider>
      </body>
    </html>
  );
}
