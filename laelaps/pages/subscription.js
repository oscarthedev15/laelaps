import React, {
  useState,
  useEffect,
} from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "../styles/Subscription.module.css";
import {
  useSwitchChain,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import {
  Ethereum,
  Goerli,
} from "@thirdweb-dev/chains";
import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { Web3Button } from "@thirdweb-dev/react";
import {
  ethers,
  toNumber,
} from "ethers";

const nftAddress =
  "0x48bffd60686b8259887862d0e73ac2087d446a5f";
const network = Goerli;
const SUBSCRIPTION_COST =
  "0.00000000000001";

export default function Utility() {
  const [times, setTimes] = useState(
    {}
  );
  const switchChain = useSwitchChain();
  const connectionStatus =
    useConnectionStatus();
  const isMismatched =
    useNetworkMismatch();
  const userAddress = useAddress();
  const router = useRouter();
  const [message, setMessage] =
    useState();

  useEffect(() => {
    (async () => {
      const chatId =
        router.query.chatId;
      const bot = router.query.bot;
      if (
        !isMismatched &&
        userAddress
      ) {
        const response = await fetch(
          "/api/subscription",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              userAddress,
              nftAddress,
              chatId,
              bot,
            }),
          }
        );
        const times =
          await response.json();
        setTimes(times);

        console.log(times);
      } else if (
        isMismatched &&
        userAddress
      ) {
        await switchChain(
          Goerli.chainId
        );
      }
    })();
  }, [
    isMismatched,
    switchChain,
    userAddress,
  ]);

  if (
    connectionStatus ===
      "disconnected" ||
    connectionStatus === "unknown"
  ) {
    return (
      <div className="flex justify-center items-center h-[80vh] w-full">
        <div className="flex flex-col gap-6 items-center justify-center min-w-[400px] p-6 bg-white border-2 border-[#9a4737] rounded-3xl shadow-[5px_5px_0px_0px_rgba(146,69,53,1)] ">
          <p className="text-black text-lg w-3/4 text-center font-prozaReg">
            Please connect your wallet
            to continue.
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
      <div className=" w-4/5">
        {times.message ? (
          <div
            className={styles.textMain}
          >
            {times.message}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-8 w-full">
              <div className="flex flex-row gap-8 items-center mt-5">
                <div className=" text-5xl text-[#682c22ff] font-quattBold">
                  Your Membership
                </div>
                <span
                  className={`inline-flex font-prozaSemi font-bold tracking-wider uppercase items-center gap-x-2 rounded-full px-4 py-2 text-lg ${
                    times?.statusObj
                      ?.status ===
                      "Expired" &&
                    "bg-red-100/90 ring-red-600/10 text-red-700 ring-1 ring-inset"
                  } ${
                    times?.statusObj
                      ?.status ===
                      "Active" &&
                    "bg-green-100/90 ring-green-600/10 text-green-700 ring-1 ring-inset"
                  }`}
                >
                  {times?.statusObj
                    ?.status ===
                  "Expired" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  )}

                  {
                    times?.statusObj
                      ?.status
                  }
                </span>
              </div>
              <div>
                <div className="text-base text-black font-prozaItal -mt-7">
                  Joined{" "}
                  {times.formattedTime}
                </div>
              </div>

              {Object.keys(times)
                .length != 0 ? (
                <div className="inline-flex items-center justify-center p-10 bg-white gap-4 w-full h-full rounded-3xl shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]">
                  <img
                    src={
                      "./images/leano.png"
                    }
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
                    <div className="flex flex-col gap-6 items-center self-center max-16 p-6 bg-white font-prozaReg border-2 border-[#9a4737] rounded-3xl shadow-[5px_5px_0px_0px_rgba(146,69,53,1)] ">
                      {times?.statusObj
                        ?.status ===
                      "Expired" ? (
                        <div className="text-black text-xl text-center">
                          Looks like
                          your
                          subscription
                          is{" "}
                          <b>
                            inactive
                          </b>
                          ! Make a
                          payment to
                          continue using
                          the bot.
                        </div>
                      ) : (
                        <div className="text-black text-xl text-center whitespace-pre-wrap">
                          <p>
                            Last Payment
                            on{" "}
                            <b>
                              {
                                times
                                  ?.statusObj
                                  ?.formattedTimestampPayment
                              }
                            </b>
                          </p>
                          <p>
                            Expiration
                            on{" "}
                            <b>
                              {
                                times
                                  ?.statusObj
                                  ?.validThru
                              }
                            </b>
                          </p>
                          If you wish,
                          you can make
                          an early
                          payment on
                          this
                          subscription.
                        </div>
                      )}
                      {times.statusObj && (
                        <Web3Button
                          contractAddress={
                            nftAddress
                          }
                          action={(
                            contract
                          ) =>
                            contract.call(
                              "paySubscription",
                              [],
                              {
                                value:
                                  ethers.utils.parseUnits(
                                    SUBSCRIPTION_COST,
                                    "ether"
                                  ),
                              }
                            )
                          }
                          onError={(
                            error
                          ) => {
                            if (
                              error.message.includes(
                                "Insufficient funds"
                              )
                            ) {
                              alert(
                                "Insufficient user funds"
                              );
                            } else {
                              alert(
                                "Error in mint"
                              );
                              console.log(
                                "*********"
                              );
                              console.log(
                                error
                              );
                            }
                          }}
                          onSuccess={(
                            result
                          ) => {
                            alert(
                              "Payment Processed"
                            );
                            location.reload();
                          }}
                          className="!bg-[#cc624a3b] !text-[#cc624a] !text-3xl !font-quattBold !rounded-3xl hover:!bg-[#cc624a47] !px-10"
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

      <div className={styles.textMain}>
        {message}
      </div>
    </div>
  );
}
