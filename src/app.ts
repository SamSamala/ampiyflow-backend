import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import instagramRoutes from "./routes/instagram.routes";
import { ENV } from "./config/env";
import automationRoutes from "./routes/automation.routes";



const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/instagram", instagramRoutes);
app.use("/automation", automationRoutes);

export default app;