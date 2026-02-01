// AI logic: prompt flow, response generation
import { AIContextRepository } from "../ai-context/aiContext.repository";
import { InterviewStage } from "../ai-context/aiContext.types";
import { WARMUP_QUESTIONS, TECHNICAL_QUESTION_BANK, HR_QUESTIONS } from "./interviewer.prompts";
import { MeetingModel } from "../meeting/meeting.model";
import { MeetingState } from "../meeting/meeting.state";

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
        // 🕒 Start the meeting timer if it's the very first question
        if (askedTexts.size === 0) {
          await MeetingModel.findByIdAndUpdate(meetingId, {
            startedAt: new Date(),
            state: MeetingState.INTERVIEW_STARTED
          });
        }

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

    // 2️⃣ Resume-based questions (Project)
    if (context.stage === InterviewStage.RESUME_BASED) {
      const askedTexts = new Set(context.askedQuestions?.map((q: any) => q.question) || []);
      const projectQuestion = "Tell me about a project from your resume you are proud of.";

      // Only ask project question if not asked yet
      if (!askedTexts.has(projectQuestion)) {
        await AIContextRepository.pushAskedQuestion(
          meetingId,
          projectQuestion,
          InterviewStage.RESUME_BASED
        );

        return {
          question: projectQuestion,
          stage: InterviewStage.RESUME_BASED,
        };
      } else {
        // Project question asked -> Move to TECHNICAL
        await AIContextRepository.update(meetingId, {
          stage: InterviewStage.TECHNICAL,
        });

        // Refresh context for next stage
        return this.getNextQuestion(meetingId);
      }
    }

    // 3️⃣ Technical Questions (Skill-based)
    if (context.stage === InterviewStage.TECHNICAL) {
      const askedTexts = new Set(context.askedQuestions?.map((q: any) => q.question) || []);
      const skills = context.skills || [];

      let nextQuestion = null;

      // Try to find a question for each skill
      for (const skill of skills) {
        // Normalize skill to lower case to match bank keys
        const normalizedSkill = skill.toLowerCase().trim();
        // Simple fuzzy match or direct lookup
        const bankKey = Object.keys(TECHNICAL_QUESTION_BANK).find(k => normalizedSkill.includes(k));

        if (bankKey) {
          const potentialQuestions = TECHNICAL_QUESTION_BANK[bankKey];
          // Find one that hasn't been asked
          const unasked = potentialQuestions.find(q => !askedTexts.has(q));
          if (unasked) {
            nextQuestion = unasked;
            break; // Found a question, stop looking (one by one)
          }
        }
      }

      // If no skill-specific question found (or all specific ones asked), try default technical questions
      if (!nextQuestion) {
        const defaultQuestions = TECHNICAL_QUESTION_BANK['default'];
        nextQuestion = defaultQuestions.find(q => !askedTexts.has(q));
      }

      if (nextQuestion) {
        await AIContextRepository.pushAskedQuestion(
          meetingId,
          nextQuestion,
          InterviewStage.TECHNICAL
        );
        return {
          question: nextQuestion,
          stage: InterviewStage.TECHNICAL,
        };
      } else {
        // All technical questions covered -> Move to BEHAVIORAL
        await AIContextRepository.update(meetingId, {
          stage: InterviewStage.BEHAVIORAL,
        });
        return this.getNextQuestion(meetingId);
      }
    }

    // 4️⃣ Behavioral (HR) Questions
    if (context.stage === InterviewStage.BEHAVIORAL) {
      const askedTexts = new Set(context.askedQuestions?.map((q: any) => q.question) || []);

      // Pick first unasked HR question
      const nextQuestion = HR_QUESTIONS.find(q => !askedTexts.has(q));

      if (nextQuestion) {
        await AIContextRepository.pushAskedQuestion(
          meetingId,
          nextQuestion,
          InterviewStage.BEHAVIORAL
        );
        return {
          question: nextQuestion,
          stage: InterviewStage.BEHAVIORAL,
        };
      } else {
        // Done with HR -> Move to WRAP_UP
        await AIContextRepository.update(meetingId, {
          stage: InterviewStage.WRAP_UP,
        });
        return this.getNextQuestion(meetingId);
      }
    }

    // 5️⃣ Wrap-Up
    if (context.stage === InterviewStage.WRAP_UP) {
      const askedTexts = new Set(context.askedQuestions?.map((q: any) => q.question) || []);
      const closingQuestion = "That covers my questions on your background. Do you have any questions for me regarding the role or the team?";

      if (!askedTexts.has(closingQuestion)) {
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

      // 🏁 End the meeting timer
      await MeetingModel.findByIdAndUpdate(meetingId, {
        endedAt: new Date(),
        state: MeetingState.COMPLETED
      });

      // Return null to signal completion
      return null;
    }

    return null;
  }
}
