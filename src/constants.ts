export enum SupportedChainId {
    BASE = 8453
}

export type AddressMap = {
    [chainId: number]: string;
};

export const JOJO_DEPOSIT_ADDRESS: AddressMap = {
    [SupportedChainId.BASE]: '0x2f7c3cF9D9280B165981311B822BecC4E05Fe635'
};

export const BASE_RPC_URL = "https://mainnet.base.org";