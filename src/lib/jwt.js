import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export function signAccessToken(userId: string) {
  return jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: "15m" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, ENV.JWT_SECRET) as { userId: string };
}