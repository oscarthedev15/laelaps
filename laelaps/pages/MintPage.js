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
import { ethers, toNumber } from "ethers";
import { useState, useEffect } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const contractAddress = "0x691c77F69a6AE05F5C8cC9f46d7E46Ce97FA2F3B";

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

  useEffect(() => {
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
      values["Mint Cost"] = mintCostEth;
      const percentageBig = await contractInstance.call("percentage");
      const percentage = percentageBig.toNumber();
      values["Percentage"] = percentage + "%";
      console.log(values["Mint Cost"]);
      return values;
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  async function mintNFT(event) {
    if (!isMismatched && userAddress) {
      try {
        setLoading(true);
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const gasPrice = await provider.getGasPrice();
        // const signer = provider.getSigner();
        // const contractInstance = new ethers.Contract(
        //   contractAddress,
        //   contractAbi,
        //   signer
        // );
        //  const txn = await contractInstance.mintNFT(userAddress, {
        //    value: ethers.utils.parseUnits(contractVals["Mint Cost"], "ether"),
        //    gasPrice: gasPrice,
        //  });

        const recepit = await txn.wait();

        console.log(recepit);
        alert(
          "Mint Successful! View your NFT on Opensea! Token address: ",
          contractAddress
        );
        setLoading(false);
      } catch (err) {
        if (err.message.includes("insufficient funds for transfer")) {
          alert("Insufficient user funds for transaction!");
        } else {
          alert("Error in Mint", err);
          console.log(err);
        }
        setLoading(false);
      }
    } else if (!isMismatched && userAddress) {
      alert("Switch to correct network!");
    } else if (!isMismatched && !userAddress) {
      alert("Please connect wallet in order to mint");
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
            contract.call("mintNFT", [userAddress], {value : ethers.utils.parseUnits(contractVals["Mint Cost"],
                  "ether")})
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
        <div className={styles.box}>
          Percent Laelaps Buy: {contractVals["Percentage"]}
        </div>
      </div>
      <br />
      
      <br />
      <div className={styles.title}>Mint Your Master Key</div>
      <br /> */}
      <div className={styles.textMain}>
        Master Key has ended! Announcements coming soon....
      </div>
        {/* <div className={styles.gifRow}>
          <div className={styles.gif}>
            <img
              src="https://cloudflare-ipfs.com/ipfs/QmRLrqVV4mzQyEZfJYv4KjfwUxZAxeh7EEMTkghPwcH5Hf"
              className={styles.gifImage}
            />
          </div>

          <div className={styles.gif}>
            <img
              src="https://cloudflare-ipfs.com/ipfs/QmW8Tow79oWqyGBYTe6HUmT8zLqb39oVqRFqBRL2imS28z"
              className={styles.gifImage}
            />
          </div>

          <div className={styles.gif}>
            <img
              src="https://cloudflare-ipfs.com/ipfs/QmWdjfJb4z3m9YkEvvRb3DY85KCkFhSEGF6YHVWB9qZe8B"
              className={styles.gifImage}
            />
          </div>

          <div className={styles.gif}>
            <img
              src="https://cloudflare-ipfs.com/ipfs/QmaVmzp7Ln8YQbZwu5ahqfWdjdcn9KEdDBctmMMAng2RfJ"
              className={styles.gifImage}
            />
          </div>

          <div className={styles.gif}>
            <img
              src="https://cloudflare-ipfs.com/ipfs/QmZ4reQiStQACTLYncxo7nsBHrB4hC1kzweu16b7SjeHWY"
              className={styles.gifImage}
            />
          </div>
        </div> */}
    </div>
  );
}
