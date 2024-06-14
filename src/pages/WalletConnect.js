import React, { useState, useEffect, useMemo } from "react";
import logo from "../assets/images/icon.png";
import { useReadContracts } from "wagmi";
import flare from "../assets/images/flare.png";
import songbird from "../assets/images/songbird.png";
import Spinner from "../components/Spinner";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { contract } from "../utils/constants";
import { CardBackground } from "../components/CardBackground";

const WalletConnect = () => {
  const { open } = useWeb3Modal();
  const [totalMinted, setTotalMinted] = useState();
  const [loading, setLoading] = useState(false);
  const [soldout, setSoldout] = useState(false);

  const { data, isSuccess } = useReadContracts({
    contracts: [{ ...contract, functionName: "totalSupply" }],
  });

  useMemo(() => {
    if (isSuccess) {
      setLoading(false);
      console.log(data[0].result);
      setTotalMinted(data[0].result?.toString());
    }
  }, [isSuccess]);

  console.log(data);

  useEffect(() => {}, []);

  async function ConnectWallet() {
    open();
  }

  return (
    <CardBackground>
      <div className="w-[400px] h-[500px] flex items-center justify-center">
        <div className="w-full h-full bg-slate-900 rounded-3xl flex flex-col items-center justify-center">
          <div className="w-full h-[100px] flex items-center gap-2 justify-center relative">
            <img src={logo} alt="logo" className="w-12 h-12" />
            <h1 className="text-3xl text-white font-robotic">Gokubi</h1>
            <h4 className="font-robotic text-white absolute bottom-2 right-10">
              🔥 Burn2Mint
            </h4>
          </div>
          <div className="w-full h-[300px] flex items-center justify-center flex-col gap-6">
            <div className="flex items-center gap-4">
              <img src={songbird} alt="songbird" className="w-8 h-8" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                  clip-rule="evenodd"
                />
              </svg>
              <img src={flare} alt="flare" className="w-8 h-8" />
            </div>
            <div className="text-white font-robotic text-xl ">
              <h1>20k $GKB Burned 🔥</h1>
            </div>
          </div>
          <div className="w-full h-[100px] flex items-center justify-center">
            <w3m-button />
          </div>
        </div>
      </div>
    </CardBackground>
  );
};

export default WalletConnect;
