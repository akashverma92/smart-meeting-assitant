// Central registry for all module routes
import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";

const router = Router();

router.use("/auth/v1", authRoutes);

export default router;
