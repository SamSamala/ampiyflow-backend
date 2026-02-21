import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BACKEND_URL}/api/auth/google`
);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const checkSession = url.searchParams.get("me");

  // 🔹 1️⃣ SESSION CHECK MODE
  if (checkSession === "true") {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      );

      return NextResponse.json(decoded);
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
  }

  // 🔹 2️⃣ GOOGLE REDIRECT MODE
  if (!code) {
    const authUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
    });

    return NextResponse.redirect(authUrl);
  }

  // 🔹 3️⃣ GOOGLE CALLBACK MODE
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 400 }
    );
  }

  const token = jwt.sign(
    {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const response = NextResponse.redirect(
    `${process.env.FRONTEND_URL}/dashboard`
  );

  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}