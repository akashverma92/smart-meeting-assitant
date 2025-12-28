import { Request, Response } from "express";
import { InterviewResultService } from "./interviewResult.service";

export class InterviewResultController {
  static async generate(req: Request, res: Response) {
    const { meetingId } = req.params;
    const result = await InterviewResultService.generateResult(meetingId);
    res.json(result);
  }

  static async publish(req: Request, res: Response) {
    const { meetingId } = req.params;
    const result = await InterviewResultService.publishResult(meetingId);
    res.json(result);
  }
}
