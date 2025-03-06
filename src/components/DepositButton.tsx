import { useAccount } from 'wagmi';
import { AarcFundKitModal } from '@aarc-xyz/fundkit-web-sdk';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import DepositModal from './IntentXDepositModal';

interface DepositButtonProps {
  aarcModal: AarcFundKitModal;
}

export const DepositButton = ({ aarcModal }: DepositButtonProps) => {
  const { address } = useAccount();

  return (
    <div className="space-y-4">
      {address ?
        <DepositModal
          aarcModal={aarcModal}
        />
        :
        <ConnectButton />
      }
    </div>
  );
};