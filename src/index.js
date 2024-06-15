import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import React from "react";
import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiProvider } from "wagmi";
import { bscTestnet, songbird,songbirdTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DotBackground } from "./components/DotBackground";

const queryClient = new QueryClient();

const projectId = "93f260c5c70b6b3e995e198ab0b9acdf";

const metadata = {
  name: "GKB Burn2Mint",
  description: "Gokubi Burn2Mint",
  url: "https://burn2-mint.vercel.app/",
  icons: ["https://burn2-mint.vercel.app/logo192.png"],
};

const chains = [songbird];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  featuredWalletIds:['c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'],
  defaultChain:songbird,
  allowUnsupportedChain: false,
  themeVariables:{
   '--w3m-font-family':'robotic',
   '--w3m-accent': '#00BB7F',
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DotBackground>
          <App />
        </DotBackground>
      </QueryClientProvider>
    </WagmiProvider>
);
