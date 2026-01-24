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

    // 2️⃣ Resume-based questions
    if (context.stage === InterviewStage.RESUME_BASED) {
      const askedTexts = new Set(context.askedQuestions?.map((q: any) => q.question) || []);

      // Priority 1: Project-based question
      const projectQuestion = "Tell me about a project from your resume you are proud of.";

      // Priority 2: Skill-based questions
      // We limit to top 3 skills to avoid endless questioning in Phase 1
      const skillQuestions = (context.skills || [])
        .slice(0, 3)
        .map((skill: string) =>
          `I see you have listed ${skill} as a skill. Can you explain a specific challenge you faced while using it?`
        );

      const candidateQuestions = [projectQuestion, ...skillQuestions];

      const nextQuestion = candidateQuestions.find((q) => !askedTexts.has(q));

      if (nextQuestion) {
        await AIContextRepository.pushAskedQuestion(
          meetingId,
          nextQuestion,
          InterviewStage.RESUME_BASED
        );

        return {
          question: nextQuestion,
          stage: InterviewStage.RESUME_BASED,
        };
      } else {
        // Done with resume questions -> Move to WRAP_UP (or TECHNICAL if implemented)
        await AIContextRepository.update(meetingId, {
          stage: InterviewStage.WRAP_UP,
        });

        const closingQuestion = "That covers my questions on your background. Do you have any questions for me regarding the role or the team?";

        await AIContextRepository.pushAskedQuestion(
          meetingId,
          closingQuestion,
          InterviewStage.WRAP_UP
        );

        return {
          question: closingQuestion,
          stage: InterviewStage.WRAP_UP
        };
      }
    }

    // 3️⃣ Wrap-Up Loop (Just keeps returning null or handles end of interview)
    if (context.stage === InterviewStage.WRAP_UP) {
      // If we already asked the closing question, we might just stop here
      return null;
    }

    return null;
  }
}
