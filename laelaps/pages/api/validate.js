import { validateAccount } from "../../api-libs/validate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Method Not Allowed" } });
    return;
  }

  const { userAddress, bot, chatId } = req.body;
  
  const balances = await validateAccount(userAddress, bot, chatId);
  
  res.json(balances);

}
