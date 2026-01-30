// just a testing file for the routes not implementaed fully yeet

import { Router, Request, Response } from "express";
import { MeetingModel } from "./meeting.model";
import { MeetingState } from "./meeting.state";
import { requireAuth } from "../../middlewares/auth.middleware";
import { AIContextService } from "../ai-context/aiContext.service";

const router = Router();

/**
 * TEMP: Create meeting (Phase-1 testing)
 */
// router.post("/start", requireAuth, async (req: Request, res: Response) => {
//   try {
//     const meeting = await MeetingModel.create({
//       meetingCode: Math.random().toString(36).substring(2, 8),
//       createdBy: req.user!.userId,
//       state: MeetingState.WAITING_FOR_RESUME, // TEMP
//     });

//     return res.status(201).json({
//       meetingId: meeting._id,
//       meetingCode: meeting.meetingCode,
//       state: meeting.state,
//     });
//   } catch (err: any) {
//     return res.status(500).json({ message: err.message });
//   }
// });

router.post("/start", requireAuth, async (req, res) => {
  const meeting = await MeetingModel.create({
    meetingCode: Math.random().toString(36).substring(2, 8),
    createdBy: req.user!.userId,
    state: MeetingState.WAITING_FOR_RESUME,
  });

  // 🔥 AI CONTEXT CREATED HERE
  await AIContextService.createInitialContext(meeting._id.toString());

  return res.status(201).json({
    meetingId: meeting._id,
    meetingCode: meeting.meetingCode,
    state: meeting.state,
  });
});


router.get("/history", requireAuth, async (req, res) => {
  try {
    const meetings = await MeetingModel.find({ createdBy: req.user!.userId })
      .sort({ createdAt: -1 }) // Newest first
      .select("meetingCode state createdAt"); // Select relevant fields

    return res.status(200).json({ meetings });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

import { requireAdmin } from "../../middlewares/auth.middleware";
import { UserModel } from "../user/user.model";

router.get("/admin/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    const meetings = await MeetingModel.find({})
      .sort({ createdAt: -1 })
      .populate("createdBy", "username email");

    return res.status(200).json({ meetings });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});


import { InterviewAnswerModel } from "../interviwer/interviewAnswer.model";

router.get("/:id/summary", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await MeetingModel.findOne({
      _id: id,
      createdBy: req.user!.userId
    });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    const answers = await InterviewAnswerModel.find({ meetingId: id })
      .sort({ createdAt: 1 }); // Chronological order

    return res.status(200).json({ meeting, answers });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/:id/evaluate", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body;

    const meeting = await MeetingModel.findByIdAndUpdate(
      id,
      { adminScore: score, adminFeedback: feedback },
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    return res.status(200).json({ meeting });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
