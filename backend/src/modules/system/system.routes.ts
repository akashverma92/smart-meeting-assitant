// /health and /version endpoints
import { Router } from "express";
import { SystemController } from "./system.controller";

const router = Router();

// Health check endpoint
router.get("/health", SystemController.health);

import { requireAuth, requireAdmin } from "../../middlewares/auth.middleware";
router.get("/stats", requireAuth, requireAdmin, SystemController.getDashboardStats);
router.get("/users-report", requireAuth, requireAdmin, SystemController.getUsersReport);
router.get("/completed-meetings", requireAuth, requireAdmin, SystemController.getCompletedMeetings);
router.get("/meetings/:id", requireAuth, requireAdmin, SystemController.getMeetingDetailsAdmin);
router.post("/meetings/:id/grade", requireAuth, requireAdmin, SystemController.gradeMeeting);

export default router;
