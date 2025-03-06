import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DepositButton } from './components/DepositButton';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';
import { AarcFundKitModal } from '@aarc-xyz/fundkit-web-sdk';
import { useRef } from 'react';
import { AarcEthWalletConnector, wagmiConfig } from '@aarc-xyz/eth-connector';
import { aarcConfig } from './config/aarcConfig';

declare global {
  interface Window {
    __VUE__: boolean;
  }
}

window.__VUE__ = true;

const queryClient = new QueryClient();

function App() {
  const aarcModalRef = useRef(
    new AarcFundKitModal(
      aarcConfig,
      import.meta.env.VITE_RUN_MODE === "development" ? "dev" : "prod",
      "https://deploy-preview-151--iframe-widget-v3.netlify.app",
    )
  );

  const aarcModal = aarcModalRef.current;

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <AarcEthWalletConnector aarcWebClient={aarcModal} debugLog={true} >
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
              <h1 className="text-xs font-bold text-center text-white">
                Aarc x IntentX
              </h1>
              <div className="flex flex-col items-center gap-4">
                <DepositButton aarcModal={aarcModal} />
              </div>
            </div>
          </div>
        </AarcEthWalletConnector>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;
