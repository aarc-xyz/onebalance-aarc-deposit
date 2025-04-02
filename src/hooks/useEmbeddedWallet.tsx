import { useWallets } from "@privy-io/react-auth";

export const useEmbeddedWallet = () => {
    const { wallets } = useWallets();
    return wallets.find((wallet) => wallet.walletClientType === "privy");
};