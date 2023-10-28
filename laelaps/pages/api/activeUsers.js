import { getActiveUsers } from "../../api-libs/activeUsers";
import Cors from 'cors';

const cors = Cors({
  methods: ['GET'], // Adjust the allowed HTTP methods as needed
});

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== "GET") {
    res.status(405).json({ error: { message: "Method Not Allowed" } });
    return;
  }

  const activeUsers = await getActiveUsers();
  
  res.json(activeUsers);

}