/// <reference types="jest" />
/// <reference types="node" />
import { EventEmitter } from 'node:events';
import type { ProviderRpcError, RequestArguments } from '@web3-react/types';
export declare class MockEIP1193Provider extends EventEmitter {
    chainId?: string;
    accounts?: string[];
    eth_chainId: jest.Mock<string | undefined, [chainId?: string | undefined], any>;
    eth_accounts: jest.Mock<string[] | undefined, [accounts?: string[] | undefined], any>;
    eth_requestAccounts: jest.Mock<string[] | undefined, [accounts?: string[] | undefined], any>;
    request(x: RequestArguments): Promise<unknown>;
    emitConnect(chainId: string): void;
    emitDisconnect(error: ProviderRpcError): void;
    emitChainChanged(chainId: string): void;
    emitAccountsChanged(accounts: string[]): void;
}
//# sourceMappingURL=MockEIP1193Provider.d.ts.map