//  API layer for AI interviewer
import { Request, Response } from "express";
import { InterviewerService } from "./interviewer.service";

export class InterviewerController {
  static async getNextQuestion(req: Request, res: Response) {
    const { meetingId } = req.params;

    const result = await InterviewerService.getNextQuestion(meetingId);

    return res.json(result);
  }
}
