// Setup: npm install alchemy-sdk
import { Alchemy, Network, fromHex } from "alchemy-sdk";
const { ethers } = require("ethers");

export async function getNFTinfo(userAddress, nftAddress) {
  const config = {
    apiKey: process.env.ALCHEMY_TOKEN,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  // Address we want get NFT mints from
  const toAddress = userAddress;

  const res = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toAddress: toAddress,
    excludeZeroValue: true,
    category: ["erc721", "erc1155"],
  });

  console.log(res);
  let txns = res.transfers
    .filter
    // (txn) => txn.rawContract.address === nftAddress //WORKS FOR NFT 721

    // (txn) => txn.asset === "LSK" // WORKS FOR NFT 1155 (no contract address for 1155 return call)
    ();
  const blockNum = fromHex(txns[0].blockNum);
  const provider = new ethers.providers.AlchemyProvider(
    "homestead",
    process.env.ALCHEMY_TOKEN
  );

  const unixTimestamp = (await provider.getBlock(blockNum)).timestamp; //UNIX!
  const returnObj = {
    blockNum: blockNum,
    timestamp: unixTimestamp,
  };

  return res;
}
