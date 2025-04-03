import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';
import { AarcFundKitModal } from '@aarc-xyz/fundkit-web-sdk';
import { useRef } from 'react';
import { AarcEthWalletConnector, wagmiConfig } from '@aarc-xyz/eth-connector';
import { aarcConfig } from './config/aarcConfig';
import DepositModal from './components/OneBalanceDepositModal';
import { PrivyProvider } from '@privy-io/react-auth';

const queryClient = new QueryClient();

function App() {
  const aarcModalRef = useRef(
    new AarcFundKitModal(aarcConfig)
  );

  const aarcModal = aarcModalRef.current;

  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      clientId={import.meta.env.VITE_PRIVY_CLIENT_ID}
      config={{
        // Display email and wallet as login methods
        appearance: {
          theme: 'dark',
          accentColor: '#A5E547',
          logo: 'https://img.notionusercontent.com/s3/prod-files-secure%2F00487f2b-db3e-4f52-b594-b60726f1e397%2Fcc627a38-99d3-4ab9-9480-d3c28fdfef91%2FDark.png/size/w=250?exp=1743691516&sig=E3OywZHnAiIbBgClO7giXRHPLkhKJ2mjh_W96ZPNhac&id=14255337-b595-807b-9505-e9d7c251b4e9&table=block&userId=141d872b-594c-8171-bac5-0002412aaedc'
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <AarcEthWalletConnector aarcWebClient={aarcModal} debugLog={true} >
            <DepositModal aarcModal={aarcModal} />
          </AarcEthWalletConnector>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

export default App;
