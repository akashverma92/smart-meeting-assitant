import { Router } from "express";
import { InterviewerController } from "./interviewer.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/:meetingId/next-question", requireAuth, InterviewerController.getNextQuestion);

export default router;
