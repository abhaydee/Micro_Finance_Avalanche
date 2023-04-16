import { Provider } from '@web3-react/types';
export declare type CoreWalletProvider = Provider & {
    isAvalanche?: boolean;
    isConnected?: () => boolean;
    providers?: CoreWalletProvider[];
};
export interface DetectCoreWalletProviderOptions {
    silent?: boolean;
    timeout?: number;
}
/**
 * Returns a Promise that resolves to the value of window.ethereum or window.avalanche
 * if it is set with the Core Wallet provider within the given timeout, or null.
 * The Promise will not reject, but an error will be thrown if invalid options
 * are provided.
 *
 * @param options - Options bag.
 * @param options.silent - Whether to silence console errors. Does not affect
 * thrown errors. Default: false
 * @param options.timeout - Milliseconds to wait for 'ethereum#initialized' to
 * be dispatched. Default: 3000
 * @returns A Promise that resolves with the Provider if it is detected within
 * given timeout, otherwise null.
 */
export declare function detectCoreWalletProvider<T = CoreWalletProvider>({ silent, timeout, }?: DetectCoreWalletProviderOptions): Promise<T | null>;
//# sourceMappingURL=utils.d.ts.map