import { AIContextRepository } from "./aiContext.repository";
import { InterviewStage } from "./aiContext.types";

export class AIContextService {

  /**
   * 🔹 Called when AI joins the meeting (IMMEDIATELY)
   */
  static async createInitialContext(meetingId: string) {
    const existing = await AIContextRepository.findByMeetingId(meetingId);
    if (existing) return existing;

    return AIContextRepository.create({
      meetingId,
      stage: InterviewStage.INTRO,
      skills: [],
      askedQuestions: [],
    });
  }

  /**
   * 🔹 Called after resume is uploaded & analyzed
   * NOTE: Does NOT change stage - stage transitions happen in interviewer.service
   */
  static async enrichWithResume({
    meetingId,
    resumeId,
    skills,
  }: {
    meetingId: string;
    resumeId: string;
    skills: string[];
  }) {
    return AIContextRepository.update(meetingId, {
      resumeId,
      skills,
      // ❌ Don't change stage here - let the interview flow naturally
      // Stage will transition to RESUME_BASED after intro questions are done
    });
  }

  /**
   * 🔹 Store asked question (prevents repetition)
   */
  static async markQuestionAsked(
    meetingId: string,
    question: string,
    stage: InterviewStage
  ) {
    return AIContextRepository.pushAskedQuestion(
      meetingId,
      question,
      stage
    );
  }
  static async setCurrentQuestion(meetingId: string, question: string) {
    return AIContextRepository.update(meetingId, {
      currentQuestion: question,
    });
  }

}
