import { Request, Response } from "express";
import { InterviewAnswerService } from "./interviewAnswer.service";

export class InterviewAnswerController {
  static async submit(req: Request, res: Response) {
    const { meetingId } = req.params;
    const { answer } = req.body;

    const saved = await InterviewAnswerService.submitAnswer({
      meetingId,
      answer,
    });

    res.status(201).json(saved);
  }
}
