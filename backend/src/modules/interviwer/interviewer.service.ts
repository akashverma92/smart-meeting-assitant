// AI logic: prompt flow, response generation
import { AIContextRepository } from "../ai-context/aiContext.repository";
import { InterviewStage } from "../ai-context/aiContext.types";
import { WARMUP_QUESTIONS } from "./interviewer.prompts";

export class InterviewerService {
  static async getNextQuestion(meetingId: string): Promise<{ question: string; stage: string } | null> {
    const context = await AIContextRepository.findByMeetingId(meetingId);

    if (!context) throw new Error("AI context not found");

    // 🔄 If there's already a current question, return it (prevents duplicates)
    if (context.currentQuestion) {
      return {
        question: context.currentQuestion,
        stage: context.stage,
      };
    }

    // 1️⃣ INTRO STAGE
    if (context.stage === InterviewStage.INTRO) {
      // Find the first question that hasn't been asked yet
      const askedTexts = new Set(context.askedQuestions?.map((q: any) => q.question) || []);
      const nextQuestion = WARMUP_QUESTIONS.find((q) => !askedTexts.has(q));

      if (nextQuestion) {
        await AIContextRepository.pushAskedQuestion(
          meetingId,
          nextQuestion,
          InterviewStage.INTRO
        );

        return {
          question: nextQuestion,
          stage: InterviewStage.INTRO,
        };
      } else {
        // All intro questions asked -> Move to RESUME_BASED
        await AIContextRepository.update(meetingId, {
          stage: InterviewStage.RESUME_BASED,
        });

        // Refresh context to pick up new stage
        return this.getNextQuestion(meetingId);
      }
    }

    // 2️⃣ Resume-based questions (later)
    if (context.stage === InterviewStage.RESUME_BASED) {
      const question = "Tell me about a project from your resume you are proud of.";

      await AIContextRepository.pushAskedQuestion(
        meetingId,
        question,
        InterviewStage.RESUME_BASED
      );

      return {
        question,
        stage: InterviewStage.RESUME_BASED,
      };
    }

    return null;
  }
}
