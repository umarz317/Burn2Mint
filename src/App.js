import React from "react";
import "./App.css";
import WalletConnect from "./pages/WalletConnect";
import MainPage from "./pages/MainPage";
import { useAccount, useAccountEffect } from "wagmi";
import { Toaster ,toast} from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react"

function App() {

  const { isConnected } = useAccount();
  useAccountEffect({onDisconnect: () => toast('Disconnected from wallet!',{icon:'⚠️'})});

  return (
    <div>
      <Analytics/>
      <Toaster position="bottom-right"/>
      {isConnected ? (
        <div>
          <MainPage />
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
