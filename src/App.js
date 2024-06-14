import React from "react";
import "./App.css";
import WalletConnect from "./pages/WalletConnect";
import MainPage from "./pages/MainPage";
import { useAccount } from "wagmi";
import { Toaster } from "react-hot-toast";

function App() {
  const { isConnected } = useAccount();

  return (
    <div>
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
