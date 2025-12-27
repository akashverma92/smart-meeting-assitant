// Central registry for all module routes
import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import systemRoutes from "./modules/system/system.routes";

import meetingRoutes from "./modules/meeting/meeting.routes";
import resumeRoutes from "./modules/resume/resume.routes";
import interviewerRoutes from "./modules/interviwer/interviewer.routes";
import interviewAnswerRoutes from "./modules/interviwer/interviewanswer.routes";
const router = Router();

router.use("/auth/v1", authRoutes);
router.use("/system/v1", systemRoutes);

router.use("/meetings/v1", meetingRoutes);
router.use("/meetings/v1", resumeRoutes);
router.use("/interviewer/v1", interviewerRoutes);
router.use("/interviewer/v1", interviewAnswerRoutes);

export default router;
