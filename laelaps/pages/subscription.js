import React, { useState, useEffect } from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "../styles/Subscription.module.css";
import { useSwitchChain } from "@thirdweb-dev/react";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import { Ethereum, Goerli } from "@thirdweb-dev/chains";
import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { Web3Button } from "@thirdweb-dev/react";
import { ethers, toNumber } from "ethers";

const nftAddress = "0x48bffd60686b8259887862d0e73ac2087d446a5f";
const network = Goerli;
const SUBSCRIPTION_COST = "0.00000000000001";

export default function Utility() {
  const [times, setTimes] = useState({});
  const switchChain = useSwitchChain();
  const isMismatched = useNetworkMismatch();
  const userAddress = useAddress();
  const router = useRouter();
  const [message, setMessage] = useState();

  useEffect(() => {
    (async () => {
      const chatId = router.query.chatId;
      const bot = router.query.bot;
      if (!isMismatched && userAddress) {
        const response = await fetch("/api/subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userAddress, nftAddress,  chatId, bot }),
        });
        const times = await response.json();
        setTimes(times);
      } else if (isMismatched && userAddress) {
        await switchChain(Goerli.chainId);
      }
    })();
  }, [isMismatched, switchChain, userAddress]);

  return (
    <div className={styles.square}>
      <ConnectWallet />
      <br />
      <div className={styles.valuesContainer}>
        {times.message ? (
          <div className={styles.textMain}>{times.message}</div>
        ) : (
          <>
            <img src={"./images/leano.png"} className={styles.image} />
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Received Date</th>
                  <th>Received Block</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{times.formattedTime || "Loading..."}</td>
                  <td>{times.blockNum || "Loading..."}</td>
                  <td>
                    {times.statusObj ? times.statusObj.status : "Loading..."}
                  </td>
                </tr>
              </tbody>
            </table>

            {times.statusObj && times.statusObj.formattedTimestampPayment && (
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Payment Date</th>
                    <th>Payment Block Block</th>
                    <th> Valid Thru</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {times.statusObj.formattedTimestampPayment ||
                        "Loading..."}
                    </td>
                    <td>{times.statusObj.blockPayment || "Loading..."}</td>
                    <td>{times.statusObj.validThru || "Loading..."}</td>

                  </tr>
                </tbody>
              </table>
            )}
            <br />
            <br />

            <br />
            {times.statusObj && times.statusObj.status == "Expired" && (
              <Web3Button
                contractAddress={nftAddress}
                action={(contract) =>
                  contract.call("paySubscription", [], {
                    value: ethers.utils.parseUnits(SUBSCRIPTION_COST, "ether"),
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
                onSuccess={(result) => {
                  alert("Payment Processed")
                  location.reload();
                }}
                className={styles.mintButton}
              >
                Make Payment
              </Web3Button>
            )}
          </>
        )}
      </div>

      <div className={styles.textMain}>{message}</div>
    </div>
  );
}
