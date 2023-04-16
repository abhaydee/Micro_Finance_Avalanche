'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var types = require('@web3-react/types');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
function detectCoreWalletProvider({ silent = false, timeout = 3000, } = {}) {
    let handled = false;
    return new Promise((resolve) => {
        if (window.ethereum || window.avalanche) {
            handleProvider();
        }
        else {
            window.addEventListener('avalanche#initialized', handleProvider, {
                once: true,
            });
            setTimeout(() => {
                handleProvider();
            }, timeout);
        }
        function handleProvider() {
            if (handled) {
                return;
            }
            handled = true;
            window.removeEventListener('avalanche#initialized', handleProvider);
            const { ethereum, avalanche } = window;
            if (ethereum && ethereum.isAvalanche) {
                resolve(ethereum);
            }
            else if (avalanche && avalanche.isAvalanche) {
                resolve(avalanche);
            }
            else {
                const message = avalanche
                    ? 'Non-CoreWallet window.avalanche detected.'
                    : 'Unable to detect window.avalanche.';
                !silent && console.error('detectCoreWalletProvider:', message);
                resolve(null);
            }
        }
    });
}

class NoCoreWalletError extends Error {
    constructor() {
        super('Core Wallet not installed');
        this.name = NoCoreWalletError.name;
        Object.setPrototypeOf(this, NoCoreWalletError.prototype);
    }
}
function parseChainId(chainId) {
    return Number.parseInt(chainId, 16);
}
class CoreWallet extends types.Connector {
    constructor({ actions, options, onError }) {
        super(actions, onError);
        this.options = options;
    }
    isomorphicInitialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.eagerConnection)
                return;
            return (this.eagerConnection = detectCoreWalletProvider(this.options).then((provider) => {
                var _a, _b;
                if (provider) {
                    this.provider = provider;
                    // handle the case when e.g. core wallet and coinbase wallet are both installed
                    if ((_a = this.provider.providers) === null || _a === void 0 ? void 0 : _a.length) {
                        this.provider =
                            (_b = this.provider.providers.find((p) => p.isAvalanche)) !== null && _b !== void 0 ? _b : this.provider.providers[0];
                    }
                    this.provider.on('connect', ({ chainId }) => {
                        this.actions.update({ chainId: parseChainId(chainId) });
                    });
                    this.provider.on('disconnect', (error) => {
                        var _a;
                        this.actions.resetState();
                        (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, error);
                    });
                    this.provider.on('chainChanged', (chainId) => {
                        this.actions.update({ chainId: parseChainId(chainId) });
                    });
                    this.provider.on('accountsChanged', (accounts) => {
                        if (accounts.length === 0) {
                            // handle this edge case by disconnecting
                            this.actions.resetState();
                        }
                        else {
                            this.actions.update({ accounts });
                        }
                    });
                }
            }));
        });
    }
    /** {@inheritdoc Connector.connectEagerly} */
    connectEagerly() {
        return __awaiter(this, void 0, void 0, function* () {
            const cancelActivation = this.actions.startActivation();
            yield this.isomorphicInitialize();
            if (!this.provider)
                return cancelActivation();
            return Promise.all([
                this.provider.request({ method: 'eth_chainId' }),
                this.provider.request({ method: 'eth_accounts' }),
            ])
                .then(([chainId, accounts]) => {
                if (accounts.length) {
                    this.actions.update({ chainId: parseChainId(chainId), accounts });
                }
                else {
                    throw new Error('No accounts returned');
                }
            })
                .catch((error) => {
                cancelActivation();
                throw error;
            });
        });
    }
    /**
     * Initiates a connection.
     *
     * @param desiredChainIdOrChainParameters - If defined, indicates the desired chain to connect to. If the user is
     * already connected to this chain, no additional steps will be taken. Otherwise, the user will be prompted to switch
     * to the chain, if one of two conditions is met: either they already have it added in their extension, or the
     * argument is of type AddEthereumChainParameter, in which case the user will be prompted to add the chain with the
     * specified parameters first, before being prompted to switch.
     */
    activate(desiredChainIdOrChainParameters) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let cancelActivation;
            if (!((_b = (_a = this.provider) === null || _a === void 0 ? void 0 : _a.isConnected) === null || _b === void 0 ? void 0 : _b.call(_a)))
                cancelActivation = this.actions.startActivation();
            return this.isomorphicInitialize()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                if (!this.provider)
                    throw new NoCoreWalletError();
                return Promise.all([
                    this.provider.request({ method: 'eth_chainId' }),
                    this.provider.request({ method: 'eth_requestAccounts' }),
                ]).then(([chainId, accounts]) => {
                    const receivedChainId = parseChainId(chainId);
                    const desiredChainId = typeof desiredChainIdOrChainParameters === 'number'
                        ? desiredChainIdOrChainParameters
                        : desiredChainIdOrChainParameters === null || desiredChainIdOrChainParameters === void 0 ? void 0 : desiredChainIdOrChainParameters.chainId;
                    // if there's no desired chain, or it's equal to the received, update
                    if (!desiredChainId || receivedChainId === desiredChainId)
                        return this.actions.update({ chainId: receivedChainId, accounts });
                    const desiredChainIdHex = `0x${desiredChainId.toString(16)}`;
                    // if we're here, we can try to switch networks
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return this.provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: desiredChainIdHex }],
                    })
                        .catch((error) => {
                        if (error.code === 4902 &&
                            typeof desiredChainIdOrChainParameters !== 'number') {
                            // if we're here, we can try to add a new network
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            return this.provider.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    Object.assign(Object.assign({}, desiredChainIdOrChainParameters), { chainId: desiredChainIdHex }),
                                ],
                            });
                        }
                        throw error;
                    })
                        .then(() => this.activate(desiredChainId));
                });
            }))
                .catch((error) => {
                cancelActivation === null || cancelActivation === void 0 ? void 0 : cancelActivation();
                throw error;
            });
        });
    }
    watchAsset({ address, symbol, decimals, image, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.provider)
                throw new Error('No provider');
            return this.provider
                .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address,
                        symbol,
                        decimals,
                        image, // A string url of the token logo
                    },
                },
            })
                .then((success) => {
                if (!success)
                    throw new Error('Rejected');
                return true;
            });
        });
    }
}

exports.CoreWallet = CoreWallet;
exports.NoCoreWalletError = NoCoreWalletError;
//# sourceMappingURL=index.js.map
