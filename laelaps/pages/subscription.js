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
var pluralize = require("pluralize");

const nftAddress =
  "0x48bffd60686b8259887862d0e73ac2087d446a5f";
const network = Goerli;
const SUBSCRIPTION_COST =
  "0.00000000000001";

export default function Utility() {
  const [times, setTimes] = useState(
    {}
  );
  const [
    expCountdown,
    setExpCountdown,
  ] = useState(["--", "--", "--"]);
  const switchChain = useSwitchChain();
  const connectionStatus =
    useConnectionStatus();
  const isMismatched =
    useNetworkMismatch();
  const userAddress = useAddress();
  const router = useRouter();
  const [message, setMessage] =
    useState();

  function getTimeTillExp() {
    const milliseconds =
      times.statusObj.validThru * 1000; // Convert seconds to milliseconds
    const countDownDate = new Date(
      milliseconds
    );

    var now = new Date().getTime();
    var timeleft = countDownDate - now;

    var days = Math.floor(
      timeleft / (1000 * 60 * 60 * 24)
    );
    var hours = Math.floor(
      (timeleft %
        (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );
    var minutes = Math.floor(
      (timeleft % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    console.log("here 2");

    setExpCountdown([
      days,
      hours,
      minutes,
    ]);
  }

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

    var interval = 0;

    if (times?.statusObj?.validThru) {
      console.log("here");
      interval = setInterval(
        getTimeTillExp,
        1000
      );
    }

    return () =>
      clearInterval(interval);
  }, [
    isMismatched,
    switchChain,
    userAddress,
    times,
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

  if (Object.keys(times).length === 0) {
    return (
      <div className="flex justify-center items-center h-[80vh] w-full">
        <p className="text-black text-lg w-3/4 text-center font-prozaReg">
          Loading...
        </p>
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
                  className={`inline-flex font-prozaBold tracking-wider uppercase items-center gap-x-2 rounded-full px-4 py-2 text-lg ${
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
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}

                  {
                    times?.statusObj
                      ?.status
                  }
                </span>
              </div>

              <div className="text-base text-black font-prozaReg -mt-7">
                Joined{" "}
                {times.mintDateObj
                  .month +
                  " " +
                  times.mintDateObj
                    .day +
                  ", " +
                  times.mintDateObj
                    .year}
              </div>
              <div className="text-base text-black font-prozaReg -mt-7">
                Txn hash:{"  "}
                <a
                  href={
                    process.env
                      .NEXT_PUBLIC_ETHERSCAN_BASE_URL +
                    times.txnHash
                  }
                  className="font-prozaSemi text-black hover:underline"
                >
                  {times.txnHash.slice(
                    0,
                    6
                  ) +
                    "..." +
                    times.txnHash.slice(
                      -4
                    )}
                </a>
              </div>

              {Object.keys(times)
                .length != 0 ? (
                <div className="flex flex-col gap-6 items-center self-center w-full mx-16 p-6 bg-white font-prozaReg border-2 border-[#9a4737] rounded-3xl shadow-[5px_5px_0px_0px_rgba(146,69,53,1)] ">
                  {times?.statusObj
                    ?.status ===
                  "Expired" ? (
                    <div className="text-black text-xl text-center">
                      Looks like your
                      subscription is{" "}
                      <span className=" font-prozaSemi">
                        inactive
                      </span>
                      ! Make a payment
                      of [price] to
                      renew your
                      subscription.
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-6 items-center">
                        <div className="flex flex-col gap-4 items-center">
                          <p className="text-black text-lg uppercase tracking-tightest text-center font-prozaSemi">
                            Last Payment
                            made on
                          </p>
                          <div className="text-[#cc624a] font-quattBold text-4xl">
                            {
                              times
                                .statusObj
                                .lastPaymentDateObj
                                .month
                            }{" "}
                            {
                              times
                                .statusObj
                                .lastPaymentDateObj
                                .day
                            }
                          </div>
                          <div className="text-base text-black font-prozaItal -mt-2">
                            Txn hash:
                            {"  "}
                            <a
                              href={
                                process
                                  .env
                                  .NEXT_PUBLIC_ETHERSCAN_BASE_URL +
                                times
                                  .statusObj
                                  .txnHash
                              }
                              className="font-prozaSemi text-black hover:underline"
                            >
                              {times.statusObj.txnHash.slice(
                                0,
                                6
                              ) +
                                "..." +
                                times.statusObj.txnHash.slice(
                                  -4
                                )}
                            </a>
                          </div>
                        </div>
                        <hr className="w-3/5 border-[#cc624a] " />
                        <div className="flex flex-col gap-4 items-center">
                          <p className="text-black text-lg uppercase tracking-tightest text-center font-prozaSemi">
                            Next payment
                            due in
                          </p>
                          <div className="flex flex-row gap-4">
                            <div className="text-center flex w-32 h-36 justify-center items-center text-[#cc624a] border-[#cc624a] border-2 ">
                              <div className="flex flex-col">
                                <div className="font-quattBold text-7xl">
                                  {
                                    expCountdown[0]
                                  }
                                </div>
                                <div className="font-quattReg text-2xl">
                                  {pluralize(
                                    "day",
                                    expCountdown[0]
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-center flex w-32 h-36 justify-center items-center text-[#cc624a] border-[#cc624a] border-2 ">
                              <div className="flex flex-col">
                                <div className="font-quattBold text-7xl">
                                  {
                                    expCountdown[1]
                                  }
                                </div>
                                <div className="font-quattReg text-2xl">
                                  {pluralize(
                                    "hour",
                                    expCountdown[1]
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-center flex w-32 h-36 justify-center items-center text-[#cc624a] border-[#cc624a] border-2 ">
                              <div className="flex flex-col">
                                <div className="font-quattBold text-7xl">
                                  {
                                    expCountdown[2]
                                  }
                                </div>
                                <div className="font-quattReg text-2xl">
                                  {pluralize(
                                    "minute",
                                    expCountdown[2]
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-base text-black font-prozaItal -mt-2">
                            Valid
                            through
                            {"  "}
                            <span className="font-prozaSemi text-black">
                              {
                                times
                                  .statusObj
                                  .validThruHumanDate
                              }
                            </span>
                          </div>
                        </div>
                        <hr className="mt-2 w-3/5 border-[#cc624a] " />

                        <p className="text-base text-center text-black font-prozaItal mt-2">
                          If you wish,
                          you can make
                          an early
                          payment of
                          [price] on
                          this
                          subscription.
                        </p>
                      </div>
                    </>
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
