import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { triggerAutomation } from "../controllers/automation.controller";

const router = Router();

router.post("/run", requireAuth, triggerAutomation);

export default router;