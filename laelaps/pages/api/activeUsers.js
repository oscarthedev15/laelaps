import { getActiveUsers } from "../../api-libs/activeUsers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: { message: "Method Not Allowed" } });
    return;
  }

  const activeUsers = await getActiveUsers();
  
  res.json(activeUsers);

}