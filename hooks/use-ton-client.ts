import { TonClient } from '@ton/ton';
import { useAsyncInitialize } from './use-async-initialize';

export function useTonClient() {
    return useAsyncInitialize(
        async () =>
            new TonClient({
                endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
            })
    );
}
