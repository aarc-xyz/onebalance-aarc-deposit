import { AarcFundKitModal } from '@aarc-xyz/fundkit-web-sdk';
import { Navbar } from './Navbar';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useEmbeddedWallet } from '../hooks/useEmbeddedWallet';
import { ADMIN_ADDRESS } from '../constants';

export const OneBalanceDepositModal = ({ aarcModal }: { aarcModal: AarcFundKitModal }) => {
    const { ready, authenticated } = usePrivy();
    const embeddedWallet = useEmbeddedWallet();
    const { login } = useLogin();

    const disableLogin = !ready || (ready && authenticated);

    const predictOneBalanceAddress = async () => {
        console.log(embeddedWallet);
        if (!embeddedWallet) return;

        const oneBalanceAddress = await fetch('/api/onebalance/api/account/predict-address', {
            method: "post",
            body: JSON.stringify({
                sessionAddress: embeddedWallet.address,
                adminAddress: ADMIN_ADDRESS,
            }),
            headers: {
                "x-api-key": import.meta.env.VITE_ONEBALANCE_API_KEY,
                "Content-Type": "application/json"
            }
        })

        const data = await oneBalanceAddress.json();
        console.log('OneBalance address', data);

        return data.predictedAddress;
    }


    const handleFundWallet = async () => {
        if (!embeddedWallet) return;

        try {
            const oneBalanceAddress = await predictOneBalanceAddress();
            console.log('OneBalance address', oneBalanceAddress);
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
            <main className="pt-24 gradient-border mt-24 pb-8 px-4 mx-auto max-w-md">
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