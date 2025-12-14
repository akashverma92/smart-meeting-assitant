// Central registry for all module routes
import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import systemRoutes from "./modules/system/system.routes";

const router = Router();

router.use("/auth/v1", authRoutes);
router.use("/system/v1", systemRoutes);

export default router;
