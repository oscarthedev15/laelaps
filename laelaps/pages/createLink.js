import axios from "axios";
import { useState, useEffect } from "react";
import dotenv from "dotenv";
import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "../styles/MintPage.module.css";
import { useSwitchChain } from "@thirdweb-dev/react";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import { Ethereum } from "@thirdweb-dev/chains";
import contractAbi20 from "../contracts/LaelapsToken.json";
import contractAbi721 from "../contracts/MasterKey.json";
import { useAddress, useContractRead, useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";

dotenv.config(); // Loads the environment variables from .env file

const laelapsAddress = "0x6c059413686565d5ad6cce6eed7742c42dbc44ca";
const masterKeyAddress = "0x691c77F69a6AE05F5C8cC9f46d7E46Ce97FA2F3B";

async function generateOneTimeLink(botToken, chatId) {
  const apiUrl = `https://api.telegram.org/bot${botToken}/createChatInviteLink`;

  try {
    const response = await axios.post(apiUrl, {
      chat_id: chatId,
      name: "Zeus Invite Link",
      member_limit: 1,
    });

    if (response.status === 200) {
      const inviteLink = response.data.result;
      return inviteLink.invite_link;
    }
  } catch (error) {
    console.error("Error generating one-time link:", error.response);
  }
}

async function getBalances(address) {
  const balances = {};
  const provider = new ethers.providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/80ff58b9b8aa43ac87a68b3012e50134"
  );
  const laelapsContract = new ethers.Contract(
    laelapsAddress,
    contractAbi20,
    provider
  );
  const laelapsBalance = await laelapsContract.balanceOf(address);
  balances["laelaps"] = laelapsBalance.toNumber();

  const masterKeyContract = new ethers.Contract(
    masterKeyAddress,
    contractAbi721,
    provider
  );
  const masterKeyBalance = await masterKeyContract.balanceOf(address);
  balances["masterKey"] = masterKeyBalance.toNumber();
  return balances;
}

export default function Utility() {
  const botToken = "5994922751:AAGeJD0XE5b7EIdi6OHzISKIXM6tliosu0I";
  const chatId = "-1001946789333";
  const [link, setLink] = useState();
  const [balances, setBalances] = useState([]);
  const switchChain = useSwitchChain();
  const isMismatched = useNetworkMismatch();
  const userAddress = useAddress();

  useEffect(() => {
    (async () => {
      if (!isMismatched && userAddress) {
        const tglink = await generateOneTimeLink(botToken, chatId);
        setLink(tglink);
        const tokenBalances = await getBalances(userAddress);
        setBalances(tokenBalances);
      } else if (isMismatched && userAddress) {
        await switchChain(Ethereum.chainId);
      }
    })();
  }, [isMismatched, switchChain, userAddress]);

  return (
    <div className={styles.square}>
      <ConnectWallet />
      <br/>
      <div className={styles.valuesContainer}>
        <div className={styles.box}>Laelaps Balance: {balances["laelaps"]} Eth</div>
        <div className={styles.box}>
          Master Key Balance: {balances["masterKey"]}
        </div>
      </div>
      {link}
    </div>
  );
}
