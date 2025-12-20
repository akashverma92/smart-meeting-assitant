import { Request, Response } from "express";
import { ResumeService } from "./resume.service";

export class ResumeController {
  static async upload(req: Request, res: Response) {
    try {
      const file = req.file;
      const userId = req.user!.userId;
      const meetingId = req.params.meetingId;

      if (!file) {
        return res.status(400).json({ message: "Resume file required" });
      }

      const resume = await ResumeService.uploadResume({
        file,
        userId,
        meetingId,
      });

      return res.status(201).json({
        message: "Resume uploaded successfully",
        resumeId: resume._id,
      });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}
