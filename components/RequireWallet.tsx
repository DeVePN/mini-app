'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { ConnectWalletModal } from './ConnectWalletModal';

interface RequireWalletProps {
  children: ReactNode;
  fallback?: ReactNode;
  modalTitle?: string;
  modalDescription?: string;
}

/**
 * Wrapper component that requires wallet connection for child actions
 *
 * Usage:
 * <RequireWallet>
 *   <Button onClick={handleProtectedAction}>Start Session</Button>
 * </RequireWallet>
 *
 * When clicked without wallet, shows modal prompting connection
 */
export function RequireWallet({
  children,
  fallback,
  modalTitle,
  modalDescription
}: RequireWalletProps) {
  const walletAddress = useTonAddress();
  const [showModal, setShowModal] = useState(false);

  // Auto-close modal when wallet connects
  useEffect(() => {
    if (walletAddress && showModal) {
      setShowModal(false);
    }
  }, [walletAddress, showModal]);

  // If wallet is connected, render children normally
  if (walletAddress) {
    return <>{children}</>;
  }

  // If wallet not connected and fallback provided, show fallback
  if (fallback) {
    return <>{fallback}</>;
  }

  // Otherwise, intercept clicks and show modal
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
      <ConnectWalletModal
        open={showModal}
        onOpenChange={setShowModal}
        title={modalTitle}
        description={modalDescription}
      />
    </>
  );
}

/**
 * Hook version for programmatic use
 *
 * Usage:
 * const requireWallet = useRequireWallet();
 *
 * const handleAction = () => {
 *   requireWallet(() => {
 *     // This only runs if wallet is connected
 *     startSession();
 *   });
 * };
 */
export function useRequireWallet() {
  const walletAddress = useTonAddress();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (walletAddress && showModal) {
      setShowModal(false);
    }
  }, [walletAddress, showModal]);

  const requireWallet = (callback: () => void) => {
    if (walletAddress) {
      callback();
    } else {
      setShowModal(true);
    }
  };

  return {
    requireWallet,
    isConnected: !!walletAddress,
    modal: (
      <ConnectWalletModal
        open={showModal}
        onOpenChange={setShowModal}
      />
    )
  };
}
