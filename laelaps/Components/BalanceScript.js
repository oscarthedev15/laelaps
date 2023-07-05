import { ethers } from "ethers";
import contractAbi20 from "../contracts/LaelapsToken.json";
import contractAbi721 from "../contracts/MasterKey.json";

const laelapsAddress = "0x6c059413686565d5ad6cce6eed7742c42dbc44ca";
const masterKeyAddress = "0x691c77F69a6AE05F5C8cC9f46d7E46Ce97FA2F3B";
const masterKeyAddressV2 = "0x992d6fbe83f3f4c938f687a6676a1155a523a20b";


export async function getBalances(address) {
  const balances = {};
  const provider = new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${process.env.INFURA}`
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

   const masterKeyContractV2 = new ethers.Contract(
     masterKeyAddressV2,
     contractAbi721,
     provider
   );
   const masterKeyBalanceV2 = await masterKeyContract.balanceOf(address);
  balances["masterKey"] += masterKeyBalanceV2.toNumber();
  return balances;
}
