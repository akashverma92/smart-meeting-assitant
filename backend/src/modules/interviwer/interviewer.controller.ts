//  API layer for AI interviewer
import { Request, Response } from "express";
import { InterviewerService } from "./interviewer.service";

export class InterviewerController {
  static async getNextQuestion(req: Request, res: Response) {
    const { meetingId } = req.params;

    const result = await InterviewerService.getNextQuestion(meetingId);

    if (!result) {
      return res.json({ finished: true, message: "Interview completed" });
    }

    return res.json(result);
  }
}
