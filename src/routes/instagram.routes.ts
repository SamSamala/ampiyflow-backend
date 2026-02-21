import { Router } from "express";
import {
  connectInstagram,
  oauthCallback,
} from "../controllers/instagram.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/connect", requireAuth, connectInstagram);
router.get("/callback", requireAuth, oauthCallback);

export default router;