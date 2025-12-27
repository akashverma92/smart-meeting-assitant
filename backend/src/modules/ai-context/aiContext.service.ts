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
      stage: InterviewStage.RESUME_BASED,
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
}
