import { Router } from "express";
import { InterviewAnswerController } from "./interviewAnswer.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/:meetingId/answer",
  requireAuth,
  InterviewAnswerController.submit
);

export default router;
