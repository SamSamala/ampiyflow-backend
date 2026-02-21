import { prisma } from "../lib/prisma";
import { decrypt } from "../lib/encrypt";
import { ENV } from "../config/env";

export async function triggerAutomation(req: any, res: any) {
  const userId = req.userId;
  const { flowData } = req.body;

  const ig = await prisma.instagramAccount.findUnique({
    where: { userId },
  });

  if (!ig) {
    return res.status(400).json({ error: "Instagram not connected" });
  }

  const accessToken = decrypt(ig.accessToken);

  const n8nRes = await fetch(process.env.N8N_WEBHOOK_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": process.env.N8N_SECRET!,
    },
    body: JSON.stringify({
      userId,
      instagramUserId: ig.instagramUserId,
      accessToken,
      flowData,
    }),
  });

  const data = await n8nRes.json();

  res.json(data);
}