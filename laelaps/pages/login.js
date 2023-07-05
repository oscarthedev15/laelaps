import { useState, useEffect } from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "../styles/MintPage.module.css";
import { useSwitchChain } from "@thirdweb-dev/react";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import { Ethereum } from "@thirdweb-dev/chains";
import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

export default function Utility() {
  const [balances, setBalances] = useState([]);
  const switchChain = useSwitchChain();
  const isMismatched = useNetworkMismatch();
  const userAddress = useAddress();
  const router = useRouter();
  const [message, setMessage] = useState();

  useEffect(() => {
    (async () => {
      if (!isMismatched && userAddress) {
        const bot = router.query.bot;
        const chatId = router.query.chatId;
        const response = await fetch("/api/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userAddress, bot, chatId }),
        });
        const balances = await response.json();
        if (balances["laelaps"] > 5000000 || balances["masterKey"] > 0) {
          setMessage("Welcome to Zeus! Return to Telegram...")
        }
        else {
          setMessage("Wallet does not have enough $Laelaps or hold a Master Key.")
        }
        setBalances(balances);
      } else if (isMismatched && userAddress) {
        await switchChain(Ethereum.chainId);
      }
    })();
  }, [isMismatched, switchChain, userAddress]);

  return (
    <div className={styles.square}>
      <ConnectWallet />
      <br />
      <div className={styles.valuesContainer}>
        <div className={styles.box}>
          Laelaps Balance: {balances["laelaps"]}{" "}
        </div>
        <div className={styles.box}>
          Master Key Balance: {balances["masterKey"]}
        </div>
      </div>
      <div className={styles.textMain}>{message}</div>
    </div>
  );
}
