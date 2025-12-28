import { Router } from "express";
import { InterviewResultController } from "./interviewResult.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/:meetingId/generate", requireAuth, InterviewResultController.generate);
router.post("/:meetingId/publish", requireAuth, InterviewResultController.publish);

export default router;
