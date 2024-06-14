import React, { useState, useEffect } from "react";
import logo from "../assets/images/icon.png";
import { useReadContract, useWriteContract } from "wagmi";
import { createPublicClient, formatEther, http } from "viem";
import {contract} from '../utils/constants'
import {CardBackground} from "../components/CardBackground";
import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { songbird } from "viem/chains";
import { toast } from "react-hot-toast";

const MainPage = () => {

  const {selectedNetworkId} = useWeb3ModalState()
  const [incorrectChain,setIncorrectChain] = useState(false)

  const [showNFTs, setShowNFTs] = useState(false)
  const [mintAmount, setMintAmount] = useState(1);
  const [mintedNFTs, setMintedNFTs] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const url = 'https://santafloki.mypinata.cloud/ipfs'
  const cid = '/QmYTZJgpMdbHuGJbAxSTwnwHbaMr98gU4RNqUdxbH6NnAW/'

  useEffect(()=>{
    console.log(selectedNetworkId)
    if(selectedNetworkId!==16){
      console.log('incorrect chain')
      setIncorrectChain(true)
    }
    else{
      setIncorrectChain(false)
    }
    setLoading(false)
  },[selectedNetworkId])

  const publicClient = createPublicClient({ 
    chain: songbird,
    transport: http()
  })

  const { refetch: fetchSupply } = useReadContract({
    ...contract,
    functionName: 'totalSupply'
  })

  const { data,isSuccess } = useReadContract({
    ...contract,
    functionName: 'basePrice'
  })

  const { writeContractAsync } = useWriteContract()


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
           
          </div>
          <div className="text-white font-robotic text-xl ">

          </div>
        </div>
        <div className="w-full h-[100px] flex items-center justify-center">
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={()=>{
            toast.success('Test toast',{duration: 1000})
          }}>
            Toast
          </button>
        </div>
      </div>
    </div>
  </CardBackground>
  );
};

export default MainPage;
