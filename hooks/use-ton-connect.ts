import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { CHAIN } from '@tonconnect/protocol';

export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  return {
    tonConnectUI,
    wallet,
    connected: !!wallet,
    network: wallet?.account.chain === CHAIN.TESTNET ? 'testnet' : 'mainnet',
  };
}
