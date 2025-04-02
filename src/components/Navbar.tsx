import DisconnectButton from "./Logout";

export const Navbar = () => {

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-aarc-bg/80 backdrop-blur-sm">
            <div className="mx-auto px-4 h-20 w-full flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <a href="https://aarc.xyz" target="_blank" rel="noopener noreferrer">
                        <img
                            className="h-12 w-auto"
                            src="/aarc-logo.svg"
                            alt="Aarc Logo"
                        />
                    </a>
                    <img
                        src="/cross-icon.svg"
                        alt="Cross"
                        className="w-6 h-6"
                    />
                    <a href="https://onebalance.io" target="_blank" rel="noopener noreferrer">
                    <img
                        className="h-4 w-18"
                        src="/one-balance-name-logo.svg"
                        alt="One Balance Logo"
                    />
                    </a>
                </div>
                <div className="flex items-center space-x-4">
                    {<DisconnectButton />}
                    {/* <img src="/dark_mode.svg" alt="Theme toggle" className="w-10 h-10" /> */}
                </div>
            </div>
        </header >
    );
};