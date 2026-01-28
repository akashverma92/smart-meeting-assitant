import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
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

    // 🧠 Enrich AI context with resume data
    const { AIContextService } = await import("../ai-context/aiContext.service");
    await AIContextService.enrichWithResume({
      meetingId: meetingId,
      resumeId: resume._id.toString(),
      skills: parsedData.skills,
    });

    return resume;
  }

  // 🔍 Basic keyword extraction (Phase-1 safe)
  private static extractSkills(text: string): string[] {
    const keywords = [
      // Frontend
      "javascript",
      "typescript",
      "react",
      "vue",
      "angular",
      "next.js",
      "nextjs",
      "html",
      "css",
      "tailwind",
      "bootstrap",

      // Backend
      "node",
      "nodejs",
      "express",
      "nestjs",
      "python",
      "django",
      "flask",
      "java",
      "spring",
      "c#",
      "dotnet",
      ".net",
      "php",
      "laravel",
      "ruby",
      "rails",
      "go",
      "golang",

      // Databases
      "mongodb",
      "sql",
      "mysql",
      "postgresql",
      "postgres",
      "redis",
      "dynamodb",
      "firebase",

      // Cloud & DevOps
      "aws",
      "azure",
      "gcp",
      "docker",
      "kubernetes",
      "jenkins",
      "git",
      "github",
      "gitlab",

      // Other
      "graphql",
      "rest",
      "api",
      "microservices",
      "agile",
      "scrum",
    ];

    return keywords.filter((k) => {
      // Escape special regex characters like . and + (for C++, .NET, etc.)
      const escapedKey = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Use word boundaries. 
      // Note: \b works for words, but for things like C# or .NET it can be tricky.
      // A simple approach is roughly: (\s|^)KEY(\s|$|,)
      const regex = new RegExp(`(^|\\b|\\s)${escapedKey}(\\b|\\s|$|,)`, 'i');

      return regex.test(text);
    });
  }
}
