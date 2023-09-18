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
import { useContractRead, useContract } from "@thirdweb-dev/react";
import { fromHex } from "alchemy-sdk";

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

  const [price, setPrice] = useState();

  const { contract } = useContract(nftAddress);
  const { data, isLoading, error } = useContractRead(contract, "mint_price");

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setPrice(fromHex(data));
    }
  }, [isLoading, data]);

  useEffect(() => {
    (async () => {
      const chatId = router.query.chatId;
      const bot = router.query.bot;
      if (!isMismatched && userAddress && price) {
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
            price
          }),
        });
        const times = await response.json();
        setTimes(times);
      } else if (isMismatched && userAddress) {
        await switchChain(Goerli.chainId);
      }
    })();
  }, [isMismatched, switchChain, userAddress, isLoading, data]);

  return (
    <div className={styles.square}>
      <ConnectWallet />
      <br />
      <div className=" w-4/5">
        {times.message ? (
          <div className={styles.textMain}>{times.message}</div>
        ) : (
          <>
            <div className="flex flex-col gap-8 w-full">
              <div className="flex flex-row gap-8 items-center mt-5">
                <div className="text-3xl text-[#8b0000] font-bold">
                  Your Membership
                </div>
                <span
                  className={`inline-flex uppercase font-bold tracking-widest items-center rounded-full px-4 py-2 text-lg ${
                    times?.statusObj?.status === "Expired" &&
                    "bg-red-500 ring-red-500/10 text-white ring-1 ring-inset"
                  } ${
                    times?.statusObj?.status === "Active" &&
                    "bg-green-500 ring-green-500/10 text-white ring-1 ring-inset"
                  }`}
                >
                  {times?.statusObj?.status}
                </span>
              </div>
              <div>
                <div className="text-xl text-black font-bold -mt-6">
                  <a href="google.com" className="text-black underline">
                    Joined
                  </a>{" "}
                  {times.formattedTime}
                </div>
              </div>

              {Object.keys(times).length != 0 ? (
                <div className="inline-flex items-center justify-center p-10 bg-white gap-4 w-full h-full rounded-3xl shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]">
                  <img
                    src={"./images/leano.png"}
                    className="h-[400px] w-auto"
                  />

                  <div className="flex flex-col gap-10 w-full">
                    {/* <div className="flex flex-col gap-2">
                      <div className="text-xl text-black font-bold">
                        Joined{" "}
                        {
                          times.formattedTime
                        }
                      </div>

                      <div className="text-lg text-gray-600 text-ellipsis">
                        transaction link
                      </div>
                    </div> */}
                    <div className="flex flex-col gap-6 items-center self-center border-2 border-[#8b0000] rounded-3xl shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)] p-6 mx-16">
                      {times?.statusObj?.status === "Expired" ? (
                        <div className="text-black text-xl text-center">
                          Looks like your subscription is <b>inactive</b>! Make
                          a payment to continue using the bot.
                        </div>
                      ) : (
                        <div className="text-black text-xl text-center whitespace-pre-wrap">
                          <p>
                            Last Payment on{" "}
                            <b>{times?.statusObj?.formattedTimestampPayment}</b>
                          </p>
                          <p>
                            Expiration on <b>{times?.statusObj?.validThru}</b>
                          </p>
                          If you wish, you can make an early payment on this
                          subscription.
                        </div>
                      )}
                      {times.statusObj && (
                        <Web3Button
                          contractAddress={nftAddress}
                          action={(contract) =>
                            contract.call("paySubscription", [], {
                              value: price,
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
                            alert("Payment Processed");
                            location.reload();
                          }}
                          className="!bg-[#8b0000] !text-white !text-3xl !rounded-3xl !px-10"
                        >
                          Make Payment
                        </Web3Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>Loading</div>
              )}
            </div>
          </>
        )}
      </div>

      <div className={styles.textMain}>{message}</div>
    </div>
  );
}
