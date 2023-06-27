import { ethers } from "ethers";
import contractAbi20 from "../contracts/LaelapsToken.json";
import contractAbi721 from "../contracts/MasterKey.json";

const laelapsAddress = "0x6c059413686565d5ad6cce6eed7742c42dbc44ca";
const masterKeyAddress = "0x691c77F69a6AE05F5C8cC9f46d7E46Ce97FA2F3B";


export async function getBalances(address) {
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
