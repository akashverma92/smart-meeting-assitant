import { Router } from "express";
import multer from "multer";

import { ResumeController } from "./resume.controller";
import { requireAuth as authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/meetings/:meetingId/resume",
  authMiddleware,
  upload.single("resume"),
  ResumeController.upload
);

export default router;
