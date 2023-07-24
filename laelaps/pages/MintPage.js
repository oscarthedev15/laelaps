import styles from "../styles/MintPage.module.css";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useSwitchChain } from "@thirdweb-dev/react";
import { Ethereum } from "@thirdweb-dev/chains";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import {
  useAddress,
  useContractWrite,
  useContract,
  Web3Button,
} from "@thirdweb-dev/react";
import contractAbi from "../contracts/MasterKey.json";
// import contractAbiv2 from "../contracts/masterKeyv2.json";

// import contractAbiv3 from "../contracts/masterKeyv3.json";
import { ethers, toNumber } from "ethers";
import { useState, useEffect } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

//ALCHEMY
import { Network, Alchemy } from "alchemy-sdk";


// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: "cLNpaQIaPfYBGmreAuiWQW2FNGfOEX4x", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const contractAddress = "0x691c77F69a6AE05F5C8cC9f46d7E46Ce97FA2F3B";
// const contractAddressv2 = "0x992d6fbe83f3f4c938f687a6676a1155a523a20b";
// const contractAddressv3 = "0xd23C9Fd8238082D901385F8F525CEE14a53c5a6c";

const TOTAL = 288;

export default function Utility() {
  const isMismatched = useNetworkMismatch();
  const userAddress = useAddress();
  const [loading, setLoading] = useState(false);
  const [contractVals, setContractVals] = useState({});
  const switchChain = useSwitchChain();
  const { contract } = useContract(contractAddress, contractAbi);
  const { mutateAsync, isLoading, error } = useContractWrite(
    contract,
    "mintNFT"
  );
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // alchemy.nft
    //   .getNftsForContract(contractAddress, { limit: 500 })
    //   .then((e) => {
    //     console.log(e.nfts.length);
    //     setTotal(e.nfts.length);
    //   });

    async function fetchData() {
      try {
        if (isMismatched && userAddress) {
          let isSwitched = false;
          try {
            isSwitched = await switchChain(Ethereum.chainId);
          } catch (err) {
            alert("Unable to switch networks");
            console.log(err);
          }
          if (isSwitched) {
            const values = await contractPriceGridValues();
            setContractVals(values);
          }
        } else if (!isMismatched && userAddress) {
          const values = await contractPriceGridValues();
          setContractVals(values);
        }
      } catch (err) {
        alert("Error switching network", err);
      }
    }
    if (userAddress) {
      fetchData();
    }
  }, [isMismatched, switchChain, userAddress]);

  async function contractPriceGridValues() {
    try {
      const sdk = new ThirdwebSDK(Ethereum);
      const values = {};
      const contractInstance = await sdk.getContract(
        contractAddress,
        contractAbi
      );

      const mintCost = await contractInstance.call("mintCost");
      const mintCostEth = ethers.utils.formatEther(mintCost);
            console.log(mintCostEth);

      values["Mint Cost"] = mintCostEth;
      // const percentageBig = await contractInstance.call("percentage");
      // const percentage = percentageBig.toNumber();
      // values["Percentage"] = percentage + "%";

      //********************************************* */
      // const remaining = await contractInstance.call("totalSupply");
      // values["remaining"] = 215 - remaining.toNumber();
      //****************************** */
      // console.log(values["remaining"]);
      return values;
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  return (
    <div className={styles.square}>
      {/* <ConnectWallet />
      <br />
      {contractVals && (
        <Web3Button
          contractAddress={contractAddress}
          contractAbi={contractAbi}
          action={(contract) =>
            contract.call("mintNFT", [userAddress], {
              value: ethers.utils.parseUnits(
                contractVals["Mint Cost"],
                "ether"
              ),
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
              contractAddress
            )
          }
          className={styles.mintButton}
        >
          MINT MASTER KEY
        </Web3Button>
      )}

      <br />
      <div className={styles.valuesContainer}>
        <div className={styles.box}>
          Mint Cost: {contractVals["Mint Cost"]} Eth
        </div>
        {/* <div className={styles.box}>Total Minted: {total}</div> */} 
        {/* <div className={styles.box}>
          Total Eth Bought Back: {(TOTAL - 253) * 0.5}
        </div> */}
        {/* <div className={styles.box}>
          NFTs Remaining: {contractVals["remaining"]}
        </div> */}
      {/* </div>  */}

       <br />
      <div className={styles.title}>Mint Your Master Key</div>
      <br />
       <br />
      <div className={styles.textMain}>
        Master Key has ended! Announcements coming soon....
      </div> 
    </div>
  );
}
