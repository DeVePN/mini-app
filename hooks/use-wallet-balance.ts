import { useTonClient } from './use-ton-client';
import { useTonAddress } from '@tonconnect/ui-react';
import { useQuery } from '@tanstack/react-query';
import { Address, fromNano } from '@ton/core';

export function useWalletBalance() {
    const client = useTonClient();
    const walletAddress = useTonAddress();

    return useQuery({
        queryKey: ['wallet-balance', walletAddress],
        queryFn: async () => {
            if (!client || !walletAddress) return null;

            const address = Address.parse(walletAddress);
            const balance = await client.getBalance(address);

            return {
                ton: parseFloat(fromNano(balance)),
                formatted: fromNano(balance)
            };
        },
        enabled: !!client && !!walletAddress,
        refetchInterval: 10000, // Refetch every 10 seconds
    });
}
