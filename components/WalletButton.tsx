'use client';

import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { formatAddress } from '@/utils/format';

export function WalletButton() {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  return (
    <div className="flex items-center gap-2">
      {address ? (
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-medium text-green-900">{formatAddress(address, 6)}</span>
        </div>
      ) : null}
      <TonConnectButton />
    </div>
  );
}
