import React, { useState, useEffect } from "react";
import logo from "../assets/images/icon.png";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

import {
  createPublicClient,
  erc20Abi,
  formatEther,
  http,
  parseEther,
} from "viem";
import { contract, GKB } from "../utils/constants";
import { CardBackground } from "../components/CardBackground";
import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { songbird } from "viem/chains";
import { toast } from "react-hot-toast";

const MainPage = () => {
  const { address } = useAccount();
  const { selectedNetworkId } = useWeb3ModalState();
  const [incorrectChain, setIncorrectChain] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (address) {
      refetch();
      refetchBalance();
    }
  }, [address]);

  const [loading, setLoading] = useState(true);

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  useEffect(() => {
    console.log(selectedNetworkId);
    if (selectedNetworkId !== 19) {
      setIncorrectChain(true);
    }
    else {
      setIncorrectChain(false);
    }
    setLoading(false);
  }, [selectedNetworkId]);

  const publicClient = createPublicClient({
    chain: songbird,
    transport: http(),
  });

  const {
    data: balance,
    isSuccess,
    refetch: refetchBalance,
  } = useReadContract({
    address: GKB,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });

  const {
    data: userData,
    isSuccess: isSuccessData,
    refetch,
  } = useReadContract({
    ...contract,
    functionName: "getBurnerData",
    args: [address],
  });

  const { writeContractAsync } = useWriteContract();

  async function burnTokens() {
    if (inputValue === "" || inputValue === "0")
      return toast.error("Please enter a valid amount to burn");
    try {
      const promise = new Promise(async (resolve, reject) => {
        var hash = await writeContractAsync(
          {
            ...contract,
            functionName: "burnTokens",
            args: [parseEther(inputValue)],
          },
          {
            onError: (e) => {
              if (e.message.includes("User denied transaction signature")) {
                reject("Transaction rejected by user!");
              } else if (e.message.includes("caller is not the owner")) {
                reject("Buring Not Activated Yet!");
              } else reject("Error Burning Tokens!");
            },
          }
        );
        var res = await publicClient.waitForTransactionReceipt({ hash: hash });
        if (res.status === "success") {
          refetch();
          refetchBalance();
          resolve("Tokens Burned Successfully!");
        } else {
          reject("Error Burning Tokens!");
        }
      });
      toast.promise(promise, {
        loading: "Burning Tokens...",
        success: (message) => {
          return message;
        },
        error: (message) => {
          return message;
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <CardBackground>
      <div className="w-[350px] lg:w-[400px] h-[500px] flex items-center justify-center">
        <div className="w-full h-full bg-slate-900 rounded-3xl flex flex-col items-center justify-center">
          <div className="w-full h-[100px] flex items-center gap-2 justify-center relative">
            <img src={logo} alt="logo" className="w-12 h-12" />
            <h1 className="text-3xl text-white font-robotic">Gokubi</h1>
            <h4 className="font-robotic text-white absolute bottom-2 right-10">
              🔥 Burn2Mint
            </h4>
          </div>

          {!incorrectChain ? (
            <>
              <hr className="w-full h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent  to-transparent opacity-25 via-neutral-400" />
              <h1 className="text-white font-robotic text-xl">Your Stats</h1>
              <hr className="w-full h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent to-transparent opacity-25 via-neutral-400" />
              <div className="w-full h-[300px] flex items-center justify-center flex-col gap-2">
                <div className="flex items-center gap-4 max-w-full p-4 justify-center">
                  <h1 className="text-white font-robotic text-xl">Balance:</h1>
                  <h2 className="text-white text-xl font-myFont truncate overflow-hidden mt-1">
                    {isSuccess
                      ? formatEther(balance).toLocaleLowerCase()
                      : "Loading..."}
                  </h2>
                </div>
                <div className="flex items-center gap-4 max-w-full p-4 justify-center">
                  <h1 className="text-white font-robotic text-xl">
                    🔥$GKB BURNED:
                  </h1>
                  <h1 className="text-white text-xl font-myFont truncate overflow-hidden mt-1">
                    {isSuccessData
                      ? formatEther(userData.burnedAmount)
                      : "Loading..."}
                  </h1>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <hr className="w-full h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent to-transparent opacity-25 via-neutral-400" />
                  <div className="max-w-md mx-auto relative">
                    <label
                      htmlFor="number-input"
                      className="block mb-2 text-sm font-medium text-white font-robotic"
                    >
                      Enter Amount To Burn:
                    </label>
                    <input
                      type="number"
                      value={inputValue}
                      id="number-input"
                      aria-describedby="Amount To Burn"
                      className="bg-gray-100 outline-none border-2 font-myFont border-green-300 text-gray-900 text-sm rounded-lg focus:border-orange-500  block w-full p-2.5"
                      placeholder="1000"
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    />
                    <button
                      className="absolute right-2 bottom-[9px] mt-2 p-1 text-black font-myFont bg-transparent ring-2 flex justify-center items-center gap-2 hover:ring-slate-800 hover:bg-black hover:text-white ring-slate-600 rounded-lg text-xs outline-none"
                      onClick={() => {
                        setInputValue(formatEther(balance));
                      }}
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full h-[100px] flex items-center justify-center">
                <button
                  className="text-white font-robotic bg-transparent ring-4 flex justify-center items-center gap-2 hover:ring-orange-800 ring-orange-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 outline-none"
                  onClick={() => {
                    burnTokens();
                  }}
                >
                  Burn{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="orange"
                    class="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className=" font-robotic w-full h-[400px] flex justify-center items-center text-center">
              <h1 className="text-white text-lg">
                Please Connect to Songbird Network
              </h1>
            </div>
          )}
        </div>
      </div>
    </CardBackground>
  );
};

export default MainPage;
