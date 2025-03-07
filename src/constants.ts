export enum SupportedChainId {
    BASE = 8453
}

export type AddressMap = {
    [chainId: number]: string;
};

export const DIAMOND_ADDRESS: AddressMap = {
    [SupportedChainId.BASE]: '0x91Cf2D8Ed503EC52768999aA6D8DBeA6e52dbe43'
};

export const MULTIACCOUNT_ADDRESS: AddressMap = {
    [SupportedChainId.BASE]: '0x8Ab178C07184ffD44F0ADfF4eA2ce6cFc33F3b86'
};

// Legacy constant kept for backward compatibility
export const INTENTX_CONTRACT_ADDRESS = DIAMOND_ADDRESS[SupportedChainId.BASE];
