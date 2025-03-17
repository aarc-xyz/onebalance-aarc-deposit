import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";

const StyledConnectButton = () => {
    return (
        <div className="w-[158px] h-[40px]">
            <RainbowConnectButton.Custom>
                {({ openConnectModal }) => {
                    return (
                        <button
                            onClick={openConnectModal}
                            className="w-full h-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-aarc-primary border border-[#0033000D]"
                        >
                            <span className="text-aarc-button-text font-semibold inline-block">Connect</span>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.83345 7.58299C6.08396 7.9179 6.40357 8.19501 6.7706 8.39554C7.13763 8.59606 7.5435 8.71531 7.96066 8.74518C8.37783 8.77506 8.79654 8.71487 9.1884 8.56869C9.58026 8.42252 9.9361 8.19378 10.2318 7.89799L11.9818 6.14799C12.5131 5.5979 12.8071 4.86114 12.8004 4.0964C12.7938 3.33166 12.487 2.60012 11.9463 2.05935C11.4055 1.51858 10.6739 1.21183 9.9092 1.20519C9.14446 1.19854 8.40771 1.49253 7.85762 2.02382L6.85428 3.02132M8.16678 6.41632C7.91627 6.08141 7.59666 5.8043 7.22963 5.60377C6.8626 5.40325 6.45674 5.284 6.03957 5.25413C5.6224 5.22425 5.20369 5.28444 4.81183 5.43062C4.41997 5.57679 4.06413 5.80553 3.76845 6.10132L2.01845 7.85132C1.48716 8.40141 1.19317 9.13817 1.19982 9.90291C1.20646 10.6676 1.51321 11.3992 2.05398 11.94C2.59475 12.4807 3.32629 12.7875 4.09103 12.7941C4.85577 12.8008 5.59253 12.5068 6.14262 11.9755L7.14012 10.978" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    );
                }}
            </RainbowConnectButton.Custom>
        </div>
    );
};

export default StyledConnectButton; 