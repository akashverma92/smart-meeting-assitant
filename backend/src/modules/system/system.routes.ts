// /health and /version endpoints
import { Router } from "express";
import { SystemController } from "./system.controller";

const router = Router();

// Health check endpoint
router.get("/health", SystemController.health);

export default router;
