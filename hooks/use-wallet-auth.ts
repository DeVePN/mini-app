import { useState, useEffect, useCallback } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { api } from '@/lib/api';
import type { BasicUserProfile } from '@/types/user';

interface WalletAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: BasicUserProfile | null;
  error: string | null;
}

interface UseWalletAuthReturn extends WalletAuthState {
  register: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  requireAuth: (callback: () => void) => void;
}

/**
 * Hook to manage wallet-based authentication
 *
 * Auto-registers/fetches user profile when wallet connects
 * Provides authentication state and helpers
 */
export function useWalletAuth(): UseWalletAuthReturn {
  const walletAddress = useTonAddress();

  const [state, setState] = useState<WalletAuthState>({
    isAuthenticated: false,
    isLoading: false,
    userProfile: null,
    error: null
  });

  /**
   * Register or fetch user profile
   */
  const register = useCallback(async () => {
    if (!walletAddress) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        userProfile: null,
        error: null
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // First, try to get existing user
      try {
        const response = await api.get<{ user: BasicUserProfile }>('/users/me', {
          headers: {
            'X-Wallet-Address': walletAddress
          }
        });

        setState({
          isAuthenticated: true,
          isLoading: false,
          userProfile: response.data.user,
          error: null
        });
        return;
      } catch (err: any) {
        // If user not found (404), register them
        if (err.response?.status === 404) {
          const registerResponse = await api.post<{ user: BasicUserProfile }>(
            '/users/register',
            {}, // Empty body for now, could add username/telegram_id later
            {
              headers: {
                'X-Wallet-Address': walletAddress
              }
            }
          );

          setState({
            isAuthenticated: true,
            isLoading: false,
            userProfile: registerResponse.data.user,
            error: null
          });
          return;
        }

        // Other errors, rethrow
        throw err;
      }
    } catch (err: any) {
      console.error('Error during user registration/fetch:', err);
      setState({
        isAuthenticated: false,
        isLoading: false,
        userProfile: null,
        error: err.message || 'Failed to authenticate'
      });
    }
  }, [walletAddress]);

  /**
   * Refresh user profile
   */
  const refreshProfile = useCallback(async () => {
    if (!walletAddress) return;

    try {
      const response = await api.get<{ user: BasicUserProfile }>('/users/me', {
        headers: {
          'X-Wallet-Address': walletAddress
        }
      });

      setState(prev => ({
        ...prev,
        userProfile: response.data.user
      }));
    } catch (err: any) {
      console.error('Error refreshing profile:', err);
    }
  }, [walletAddress]);

  /**
   * Helper to require authentication before executing a callback
   * If not authenticated, this will be caught by RequireWallet component
   */
  const requireAuth = useCallback(
    (callback: () => void) => {
      if (state.isAuthenticated && walletAddress) {
        callback();
      }
      // If not authenticated, callback won't run
      // The UI should handle showing the connect wallet modal
    },
    [state.isAuthenticated, walletAddress]
  );

  /**
   * Auto-register/fetch profile when wallet connects
   */
  useEffect(() => {
    if (walletAddress && !state.isAuthenticated && !state.isLoading) {
      register();
    }
  }, [walletAddress, state.isAuthenticated, state.isLoading, register]);

  return {
    ...state,
    register,
    refreshProfile,
    requireAuth
  };
}
