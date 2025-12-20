import fs from "fs";
import path from "path";
const pdfParse = require("pdf-parse");
import mammoth from "mammoth";

import { ResumeRepository } from "./resume.repository";
import { MeetingModel } from "../meeting/meeting.model";
import { MeetingState } from "../meeting/meeting.state";
import { assertTransition } from "../meeting/meeting.transition";

export class ResumeService {
  static async uploadResume({
    file,
    userId,
    meetingId,
  }: {
    file: Express.Multer.File;
    userId: string;
    meetingId: string;
  }) {
    const meeting = await MeetingModel.findById(meetingId);
    if (!meeting) throw new Error("Meeting not found");

    // 🔐 Enforce meeting state
    if (meeting.state !== MeetingState.WAITING_FOR_RESUME) {
      throw new Error("Resume upload not allowed at this stage");
    }

    // 🔁 Ensure state transition
    assertTransition(
      meeting.state,
      MeetingState.RESUME_UPLOADED
    );

    const ext = path.extname(file.originalname).replace(".", "");

    let rawText = "";

    if (ext === "pdf") {
      const data = await pdfParse(file.buffer);
      rawText = data.text;
    } else if (ext === "docx") {
      const result = await mammoth.extractRawText({
        buffer: file.buffer,
      });
      rawText = result.value;
    } else {
      throw new Error("Unsupported resume format");
    }

    // 🧠 Simple parsing (Phase-1)
    const parsedData = {
      skills: this.extractSkills(rawText),
      projects: [],
      experience: [],
    };

    const resume = await ResumeRepository.create({
      userId,
      meetingId,
      fileUrl: `memory://${file.originalname}`, // replace with S3 later
      fileType: ext,
      rawText,
      parsedData,
    });

    // 🔄 Update meeting
    meeting.resumeId = resume._id;
    meeting.state = MeetingState.RESUME_UPLOADED;
    await meeting.save();

    // Move to analyzed
    assertTransition(
      MeetingState.RESUME_UPLOADED,
      MeetingState.RESUME_ANALYZED
    );
    meeting.state = MeetingState.RESUME_ANALYZED;
    await meeting.save();

    return resume;
  }

  // 🔍 Basic keyword extraction (Phase-1 safe)
  private static extractSkills(text: string): string[] {
    const keywords = [
      "javascript",
      "typescript",
      "react",
      "node",
      "mongodb",
      "python",
      "java",
      "sql",
    ];

    return keywords.filter((k) =>
      text.toLowerCase().includes(k)
    );
  }
}
