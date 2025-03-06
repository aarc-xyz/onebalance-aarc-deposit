import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { AarcFundKitModal } from '@aarc-xyz/fundkit-web-sdk';
import { INTENTX_CONTRACT_ADDRESS } from '../constants';


// SVG for USDC icon
const UsdcIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#2775CA" />
        <path d="M12 17.5c-3.038 0-5.5-2.462-5.5-5.5S8.962 6.5 12 6.5s5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5zm0-9.625c-2.28 0-4.125 1.845-4.125 4.125S9.72 16.125 12 16.125s4.125-1.845 4.125-4.125S14.28 7.875 12 7.875z" fill="white" />
        <path d="M13.375 14.438h-2.75v-1.376h2.75v1.376zm0-3.438h-2.75V9.625h2.75V11z" fill="white" />
    </svg>
);

const DepositModal = ({ aarcModal }: { aarcModal: AarcFundKitModal }) => {
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { address } = useAccount();
    const handleDeposit = async () => {
        if (!address) return;

        try {
            setIsProcessing(true);

            // Generate calldata for depositFor function
            const generateDepositForCallData = (userAddress: string): string => {
                const accountFacetInterface = new ethers.Interface([
                    "function depositFor(address user, uint256 amount) external",
                ]);

                const amountInWei = ethers.parseUnits(amount, 6); // USDC has 6 decimals

                return accountFacetInterface.encodeFunctionData("depositFor", [
                    userAddress,
                    amountInWei,
                ]);
            };

            const contractPayload = generateDepositForCallData(address);

            aarcModal.updateRequestedAmount(Number(amount));

            // Update Aarc's destination contract configuration
            aarcModal.updateDestinationContract({
                contractAddress: INTENTX_CONTRACT_ADDRESS,
                contractName: "IntentX Deposit",
                contractGasLimit: "800000",
                contractPayload: contractPayload,
                contractLogoURI: "data:image/png;base64,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"
            });

            // Open the Aarc modal
            aarcModal.openModal();

        } catch (error) {
            console.error("Error preparing deposit:", error);
            setIsProcessing(false);
        }
    };


    return (
            <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-md text-white">
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <div className="text-sm text-gray-400">Account to Deposit in</div>
                            <div className="flex items-center space-x-2">
                                <div className="bg-gray-600 w-5 h-5 rounded-full"></div>
                                <div>
                                    <div>{address}</div>
                                </div>
                            </div>
                    </div>

                    <div className="space-y-2">

                        <div className="relative flex items-center">
                            <div className="absolute left-3">
                                <UsdcIcon />
                            </div>
                            <input
                                className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                type="text"
                                inputMode="decimal"
                                pattern="^[0-9]*[.,]?[0-9]*$"
                                placeholder="Enter amount to deposit"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                                style={{ backgroundColor: '#1f2937', color: 'white' }}
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {[1, 5, 10, 20].map((percent) => (
                                <button
                                    key={percent}
                                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white whitespace-nowrap"
                                    onClick={() => setAmount(percent.toString())}
                                    style={{ backgroundColor: '#1f2937' }}
                                >
                                    {percent} USDC
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-start space-x-2 p-3 bg-gray-800 bg-opacity-50 rounded-md text-sm" style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}>
                        <span>
                            <strong>Important!</strong> To withdraw your deposited funds, please wait 720 minutes (12 hours) from the time of deposit.
                        </span>
                    </div>

                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        className={`w-full p-3 rounded-md font-medium ${!isProcessing
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-700 cursor-not-allowed text-gray-300'
                            }`}
                        disabled={isProcessing}
                        onClick={handleDeposit}
                        style={{ backgroundColor: !isProcessing ? '#2563eb' : '#374151' }}
                    >
                        {isProcessing ? 'Processing...' : 'Continue'}
                    </button>
                </div>
            </div>
    );
};

export default DepositModal;