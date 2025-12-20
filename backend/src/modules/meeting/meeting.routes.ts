// just a testing file for the routes not implementaed fully yeet

import { Router, Request, Response } from "express";
import { MeetingModel } from "./meeting.model";
import { MeetingState } from "./meeting.state";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * TEMP: Create meeting (Phase-1 testing)
 */
router.post("/start", requireAuth, async (req: Request, res: Response) => {
  try {
    const meeting = await MeetingModel.create({
      meetingCode: Math.random().toString(36).substring(2, 8),
      createdBy: req.user!.userId,
      state: MeetingState.WAITING_FOR_RESUME, // TEMP
    });

    return res.status(201).json({
      meetingId: meeting._id,
      meetingCode: meeting.meetingCode,
      state: meeting.state,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
