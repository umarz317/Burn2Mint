import React from "react";
import "./App.css";
import WalletConnect from "./pages/WalletConnect";
import MintPage from "./pages/MintPage";
import { useAccount } from "wagmi";
import { DotBackground } from "./components/DotBackground";

function App() {
  const { isConnected } = useAccount();

  return (
    <div>
      {isConnected ? (
        <div>
          {/* <MintPage /> */}
        </div>
      ) : (
        <div>
          <WalletConnect />
        </div>
      )}
    </div>
  );
}

export default App;
