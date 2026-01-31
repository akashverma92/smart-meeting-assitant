// /health and /version endpoints
import { Router } from "express";
import { SystemController } from "./system.controller";

const router = Router();

// Health check endpoint
router.get("/health", SystemController.health);

import { requireAuth, requireAdmin } from "../../middlewares/auth.middleware";
router.get("/stats", requireAuth, requireAdmin, SystemController.getDashboardStats);

export default router;
