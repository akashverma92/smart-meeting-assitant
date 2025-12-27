// AI logic: prompt flow, response generation
import { AIContextRepository } from "../ai-context/aiContext.repository";
import { InterviewStage } from "../ai-context/aiContext.types";
import { WARMUP_QUESTIONS } from "./interviewer.prompts";

export class InterviewerService {
  static async getNextQuestion(meetingId: string) {
    const context = await AIContextRepository.findByMeetingId(meetingId);

    if (!context) throw new Error("AI context not found");

    // 1️⃣ INTRO STAGE
    if (context.stage === InterviewStage.INTRO) {
      const question = WARMUP_QUESTIONS[0];

      await AIContextRepository.pushAskedQuestion(
        meetingId,
        question,
        InterviewStage.INTRO
      );

      return {
        question,
        stage: InterviewStage.INTRO,
      };
    }

    // 2️⃣ Resume-based questions (later)
    if (context.stage === InterviewStage.RESUME_BASED) {
      return {
        question: "Tell me about a project from your resume you are proud of.",
        stage: InterviewStage.RESUME_BASED,
      };
    }

    return null;
  }
}
