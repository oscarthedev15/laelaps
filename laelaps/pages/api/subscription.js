import { getNFTinfo } from "../../api-libs/NFTinfo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Method Not Allowed" } });
    return;
  }

  const { userAddress, nftAddress, chatId, botId, price } = req.body;
  const nftInfo = await getNFTinfo(userAddress, nftAddress, chatId, botId, price);

  res.json(nftInfo);
  
}
