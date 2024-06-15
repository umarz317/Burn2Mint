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

const projectId = "85dffe8a96cad6edf73da08d7d1152fb";

const metadata = {
  name: "GKB Burn2Mint",
  description: "Gokubi Burn2Mint",
  url: "https://sfminting.vercel.app/",
  icons: ["https://sfminting.vercel.app/logo192.png"],
};

const chains = [songbirdTestnet];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  defaultChain:songbirdTestnet,
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
