import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { signAccessToken } from "../lib/jwt";

export async function register(req: any, res: any) {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash: hash },
  });

  const token = signAccessToken(user.id);

  res.json({ token });
}

export async function login(req: any, res: any) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ error: "Invalid" });

  const token = signAccessToken(user.id);
  res.json({ token });
}