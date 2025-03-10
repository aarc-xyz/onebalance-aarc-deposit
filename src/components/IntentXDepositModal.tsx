import { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { AarcFundKitModal } from '@aarc-xyz/fundkit-web-sdk';
import { BASE_RPC_URL, DIAMOND_ADDRESS, MULTIACCOUNT_ADDRESS, multiAccountAbi, SupportedChainId } from '../constants';
import { UsdcIcon } from '../icons/UsdIcon';
import {  BASE_CHAIN_ID } from '../chain';

interface SubAccount {
    accountAddress: string;
    name: string;
}

const DepositModal = ({ aarcModal }: { aarcModal: AarcFundKitModal }) => {
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<string>('');
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [isWrongNetwork, setIsWrongNetwork] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const { address, chain } = useAccount();

    // Create provider instance
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

    useEffect(() => {
        if (chain) {
            setIsWrongNetwork(chain.id !== BASE_CHAIN_ID);
        }
    }, [chain]);

    useEffect(() => {
        if (address) {
            fetchSubAccounts();
        }
    }, [address]);

    const fetchSubAccounts = async () => {
        if (!address) return;

        try {
            const multiAccountContract = new ethers.Contract(
                MULTIACCOUNT_ADDRESS[SupportedChainId.BASE],
                multiAccountAbi,
                provider
            );

            const accountsLength = await multiAccountContract.getAccountsLength(address);

            if (Number(accountsLength) > 0) {
                // Get all accounts
                const accounts = await multiAccountContract.getAccounts(address, 0, accountsLength);
                setSubAccounts(accounts);
                if (accounts.length > 0) {
                    setSelectedAccount(accounts[0].accountAddress);
                }
            }
        } catch (error) {
            console.error("Error fetching sub accounts:", error);
        }
    };

    const { writeContract: addAccount } = useWriteContract();

    const handleCreateAccount = async () => {
        if (!address || !newAccountName || isCreatingAccount) return;

        try {
            setIsCreatingAccount(true);
            
            addAccount({
                address: MULTIACCOUNT_ADDRESS[SupportedChainId.BASE] as `0x${string}`,
                abi: multiAccountAbi,
                functionName: 'addAccount',
                args: [newAccountName],
            });

            setNewAccountName('');
        } catch (error) {
            console.error("Error creating account:", error);
        } finally {
            setIsCreatingAccount(false);
        }
    };

    const handleDeposit = async () => {
        if (!address || !selectedAccount) return;

        try {
            setIsProcessing(true);

            // Generate calldata for depositFor function on Diamond contract
            const diamondInterface = new ethers.Interface([
                "function depositFor(address user, uint256 amount) external",
            ]);

            const amountInWei = ethers.parseUnits(amount, 6); // USDC has 6 decimals

            const contractPayload = diamondInterface.encodeFunctionData("depositFor", [
                selectedAccount, // Use the selected subaccount address
                amountInWei,
            ]);

            aarcModal.updateRequestedAmount(Number(amount));

            // Update Aarc's destination contract configuration
            aarcModal.updateDestinationContract({
                contractAddress: DIAMOND_ADDRESS[SupportedChainId.BASE],
                contractName: "IntentX Deposit",
                contractGasLimit: "800000",
                contractPayload: contractPayload,
                contractLogoURI: "data:image/png;base64,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"
            });

            // Open the Aarc modal
            aarcModal.openModal();
            setAmount('');
            setIsProcessing(false);
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
                        {subAccounts.length > 0 ? (
                            <div className="space-y-2">
                                <select
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    value={selectedAccount}
                                    onChange={(e) => setSelectedAccount(e.target.value)}
                                    style={{ backgroundColor: '#1f2937' }}
                                >
                                    {subAccounts.map((account) => (
                                        <option key={account.accountAddress} value={account.accountAddress}>
                                            {account.name} ({account.accountAddress})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-400">No sub accounts found. Create one below.</div>
                        )}

                        {/* Create New Account Section */}
                        { 
                        subAccounts.length <= 0 && <div className="mt-4 space-y-2">
                            <div className="flex flex-col gap-y-2 space-x-2">
                                <input
                                    className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    type="text"
                                    placeholder="Enter new account name"
                                    value={newAccountName}
                                    onChange={(e) => setNewAccountName(e.target.value)}
                                    style={{ backgroundColor: '#1f2937' }}
                                />
                                <button
                                    className={`p-2 rounded-md font-medium ${
                                        !isCreatingAccount && newAccountName
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-gray-700 cursor-not-allowed text-gray-300'
                                    }`}
                                    disabled={isCreatingAccount || !newAccountName || isWrongNetwork}
                                    onClick={handleCreateAccount}
                                    style={{ backgroundColor: !isCreatingAccount && newAccountName ? '#2563eb' : '#374151' }}
                                >
                                    {isCreatingAccount ? 'Creating...' : isWrongNetwork ? 'Please switch to Base network' : 'Create'}
                                </button>
                            </div>
                        </div>
                        }
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
                        className={`w-full p-3 rounded-md font-medium ${
                            !isProcessing && selectedAccount
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-700 cursor-not-allowed text-gray-300'
                        }`}
                        disabled={isProcessing || !selectedAccount || !amount}
                        onClick={handleDeposit}
                        style={{ backgroundColor: !isProcessing && selectedAccount && amount ? '#2563eb' : '#374151' }}
                    >
                        {isProcessing ? 'Processing...' : 'Continue'}
                    </button>
                </div>
            </div>
    );
};

export default DepositModal;