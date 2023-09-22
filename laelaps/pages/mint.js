import styles from "../styles/MintPage.module.css";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useSwitchChain } from "@thirdweb-dev/react";
import { Ethereum } from "@thirdweb-dev/chains";
import { useNetworkMismatch, useConnectionStatus } from "@thirdweb-dev/react";
import {
  useAddress,
  useContractRead,
  useContract,
  useOwnedNFTs,
  Web3Button,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";

import { ethers, toNumber } from "ethers";
import { useState, useEffect } from "react";
import { fromHex } from "alchemy-sdk";

const nftAddress = "0x48bffd60686b8259887862d0e73ac2087d446a5f";

export default function Utility() {
  const isMismatched = useNetworkMismatch();
  const userAddress = useAddress();
  const [loading, setLoading] = useState(false);
  const [nftMintInfo, setNFTMintInfo] = useState({});
  const [contractVals, setContractVals] = useState({});
  const switchChain = useSwitchChain();
  const router = useRouter();
  const { contract } = useContract(nftAddress);
  const [mintPrice, setMintPrice] = useState();

  const connectionStatus = useConnectionStatus();
  const { data: userNFTs } = useOwnedNFTs(contract, userAddress);
  const { data, isLoading, error } = useContractRead(contract, "mint_price");

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setMintPrice(fromHex(data));
    }
  }, [isLoading, data]);

  useEffect(() => {
    (async () => {
      const chatId = router.query.chatId;
      const bot = router.query.bot;
      if (!isMismatched && userAddress && mintPrice) {
        const response = await fetch("/api/subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userAddress,
            nftAddress,
            chatId,
            bot,
            price: mintPrice,
          }),
        });
        const res = await response.json();
        setNFTMintInfo(res);
        console.log(res);
      } else if (isMismatched && userAddress) {
        await switchChain(Goerli.chainId);
      }
    })();
  }, [isMismatched, switchChain, userAddress, mintPrice]);

  if (connectionStatus === "disconnected" || connectionStatus === "unknown") {
    return (
      <div className="flex justify-center items-center h-[80vh] w-full">
        <div className="flex flex-col gap-6 items-center justify-center min-w-[400px] p-6 bg-white border-2 border-[#9a4737] rounded-3xl shadow-[5px_5px_0px_0px_rgba(146,69,53,1)] ">
          <p className="text-black text-lg w-3/4 text-center font-prozaReg">
            Please connect your wallet to continue.
          </p>
          <ConnectWallet className="!text-2xl !bg-[#cc624a3b] !text-[#cc624a] !font-quattBold !px-4 hover:!bg-[#cc624a47]" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.square}>
      <ConnectWallet />
      <br />

      <div className="w-4/5 mt-5 flex flex-row justify-between items-center">
        <img
          src={"./images/leano.png"}
          className="h-auto max-w-[300px] hover:shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0 rounded-md"
        />

        {!userNFTs?.length && mintPrice ? (
          <div className="relative flex flex-col flex-grow gap-6 text-center items-center min-h-[300px] justify-center ml-16 p-6 bg-white font-prozaReg border-2 border-[#9a4737] rounded-3xl shadow-[5px_5px_0px_0px_rgba(146,69,53,1)] ">
            <p className="text-3xl font-quattBold text-black">
              Want in? Mint your membership NFT below!
            </p>

            <div className="flex flex-col">
              <div className="text-xl uppercase text-[#cc624a]  font-prozaMed tracking-tightest">
                price
              </div>
              <div className="text-black text-xl font-prozaItal">
                {ethers.utils.formatEther(mintPrice)} ETH
              </div>
            </div>
            <hr className="w-3/5 border-[#cc624a]" />

            <Web3Button
              contractAddress={nftAddress}
              action={(contract) =>
                contract.call("mintToPaid", [userAddress, 0], {
                  value: mintPrice,
                })
              }
              onError={(error) => {
                if (error.message.includes("Insufficient funds")) {
                  alert("Insufficient user funds");
                } else {
                  alert("Error in mint");
                  console.log("*********");
                  console.log(error);
                }
              }}
              onSuccess={(result) =>
                alert(
                  "Mint Successful! View your NFT on Opensea! Token address: ",
                  nftAddress
                )
              }
              className="!bg-[#cc624a3b] !text-[#cc624a] !text-3xl !font-quattBold !rounded-3xl hover:!bg-[#cc624a47] !px-10"
            >
              Mint NFT
            </Web3Button>
          </div>
        ) : (
          <div className="relative flex flex-col flex-grow gap-6 text-center items-center min-h-[300px] justify-center ml-16 p-6 bg-white font-prozaReg border-2 border-[#9a4737] rounded-3xl shadow-[5px_5px_0px_0px_rgba(146,69,53,1)] ">
            <p className="text-3xl font-quattBold text-black">
              Welcome membership holder!
            </p>
            <hr className="w-3/5 border-[#cc624a]" />
            <div className="flex flex-col gap-5 items-center w-4/5">
              <div className="text-xl uppercase text-stone-600 font-prozaMed tracking-tightest">
                Member since{" "}
              </div>
              <div className="text-[#cc624a] text-4xl font-quattBold">
                {nftMintInfo?.mintDateObj?.month +
                  " " +
                  nftMintInfo?.mintDateObj?.day +
                  ", " +
                  nftMintInfo?.mintDateObj?.year}
              </div>
              <div className="text-base text-black font-prozaItal -mt-3">
                Txn hash:
                {"  "}
                <a
                  href={
                    process.env.NEXT_PUBLIC_ETHERSCAN_BASE_URL +
                    nftMintInfo?.txnHash
                  }
                  className="font-prozaSemi text-black hover:underline"
                >
                  {nftMintInfo?.txnHash?.slice(0, 6) +
                    "..." +
                    nftMintInfo?.txnHash?.slice(-4)}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
