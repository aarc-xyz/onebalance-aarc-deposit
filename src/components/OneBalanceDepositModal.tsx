import { useState } from 'react';
import { AarcFundKitModal } from '@aarc-xyz/fundkit-web-sdk';
import { Navbar } from './Navbar';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useEmbeddedWallet } from '../hooks/useEmbeddedWallet';
import { ADMIN_ADDRESS } from '../constants';
import { CheckIcon } from '../icons/CheckIcon';
import { CopyIcon } from '../icons/CopyIcon';

const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const OneBalanceDepositModal = ({ aarcModal }: { aarcModal: AarcFundKitModal }) => {
    const [copied, setCopied] = useState(false);
    const { ready, authenticated } = usePrivy();
    const embeddedWallet = useEmbeddedWallet();
    const { login } = useLogin();

    const handleCopyAddress = async () => {
        if (embeddedWallet?.address) {
            await navigator.clipboard.writeText(embeddedWallet.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }
    };

    const disableLogin = !ready || (ready && authenticated);

    const predictOneBalanceAddress = async () => {
        if (!embeddedWallet) return;

        const oneBalanceAddress = await fetch('/.netlify/functions/predict-address', {
            method: "post",
            body: JSON.stringify({
                sessionAddress: embeddedWallet.address,
                adminAddress: ADMIN_ADDRESS,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!oneBalanceAddress.ok) {
            throw new Error(`HTTP error! status: ${oneBalanceAddress.status}`);
        }

        const data = await oneBalanceAddress.json();

        return data.predictedAddress;
    }


    const handleFundWallet = async () => {
        if (!embeddedWallet) return;

        try {
            const oneBalanceAddress = await predictOneBalanceAddress();
            if (!oneBalanceAddress) return;
            aarcModal.updateDestinationWalletAddress(oneBalanceAddress);
            aarcModal.openModal();
        } catch (error) {
            console.error("Error preparing deposit:", error);
            aarcModal.close();
        }
    };

    return (
        <div className="min-h-screen bg-aarc-bg grid-background">
            <Navbar />
            <main className="pt-8 gradient-border mt-24 pb-8 px-7 mx-auto max-w-md">
                {!disableLogin ? (
                    <div className="flex items-center w-full justify-center gap-x-2">
                        <span className="text-aarc-text text-xs font-bold">Deposit into your </span>
                        <img src="/one-balance-name-logo.svg" alt="Aarc Logo" className="w-[54px] h-[32px]" />
                        <span className="text-aarc-text text-xs font-semibold">account</span>
                    </div>
                ) : (
                        <div className="box-border flex w-full items-center  px-2 py-3 gap-2.5 border border-[#424242] rounded-2xl flex-grow-0 z-[5]">
                        <img src="/onebalance.png" alt="Ethereum" className="w-6 h-6" />
                        <div className="flex flex-col items-start center gap-2">
                            <div className="text-[#C3C3C3] text-xs font-medium">EVM Address</div>
                            <div className="text-white text-sm font-semibold">{formatAddress(embeddedWallet?.address)}</div>
                        </div>
                        <button
                            onClick={handleCopyAddress}
                            className="ml-auto hover:opacity-80 transition-opacity"
                            title={copied ? "Copied!" : "Copy address"}
                        >
                            {copied ? <CheckIcon /> : <CopyIcon />}
                        </button>
                    </div>
                )}


                {!disableLogin ? (
                    <button className="login-signup-button" disabled={disableLogin} onClick={login}>
                        Login or Signup
                    </button>
                ) :
                    (
                        <button className="login-signup-button" onClick={handleFundWallet}>
                            Fund wallet
                        </button>
                    )}

                <div className="mt-2 flex items-center justify-center space-x-0.5 text-aarc-text">
                    <span className="font-semibold text-[10.94px] leading-none">Powered by</span>
                    <a href="https://aarc.xyz" target="_blank" rel="noopener noreferrer">
                        <img
                            src="/aarc-logo.svg"
                            alt="Aarc Logo"
                            className="w-[54px] h-[32px]"
                        />
                    </a>
                </div>
                <div className="text-center text-[10px] leading-none text-aarc-text">
                    By using this service, you agree to Aarc terms
                </div>
            </main>
        </div>
    )
};

export default OneBalanceDepositModal;