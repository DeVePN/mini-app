'use client';

import { useTonConnectUI } from '@tonconnect/ui-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

interface ConnectWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

/**
 * Modal that prompts user to connect their TON wallet
 */
export function ConnectWalletModal({
  open,
  onOpenChange,
  title = 'Connect Your Wallet',
  description = 'Connect your TON wallet to continue using this feature.'
}: ConnectWalletModalProps) {
  const [tonConnectUI] = useTonConnectUI();

  const handleConnect = async () => {
    try {
      await tonConnectUI.openModal();
      // Modal will auto-close when wallet connects via the useEffect in RequireWallet
    } catch (error) {
      console.error('Error opening TON Connect modal:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm text-center text-muted-foreground">
            To use DeVPN features like starting sessions and managing connections, you need to connect your TON wallet.
          </p>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={handleConnect}
            className="w-full sm:w-auto"
            size="lg"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect TON Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
