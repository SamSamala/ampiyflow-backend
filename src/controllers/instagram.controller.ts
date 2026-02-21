import { prisma } from "../lib/prisma";
import { ENV } from "../config/env";
import { encrypt } from "../lib/encrypt";

export async function connectInstagram(req: any, res: any) {
  const userId = req.userId;

  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${ENV.META_APP_ID}&redirect_uri=${ENV.META_REDIRECT_URI}&scope=instagram_basic,instagram_manage_messages`;

  res.json({ url: authUrl });
}

export async function oauthCallback(req: any, res: any) {
  const { code } = req.query;

  const tokenRes = await fetch(
    "https://graph.facebook.com/v19.0/oauth/access_token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: ENV.META_APP_ID,
        client_secret: ENV.META_APP_SECRET,
        redirect_uri: ENV.META_REDIRECT_URI,
        code,
      }),
    }
  );

  const tokenData = await tokenRes.json();

  const encryptedToken = encrypt(tokenData.access_token);

  await prisma.instagramAccount.upsert({
    where: { userId: req.userId },
    update: {
      accessToken: encryptedToken,
      tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    create: {
      userId: req.userId,
      instagramUserId: "placeholder",
      username: "placeholder",
      accessToken: encryptedToken,
      tokenExpiresAt: new Date(),
    },
  });

  res.redirect(`${ENV.FRONTEND_URL}/dashboard`);
}