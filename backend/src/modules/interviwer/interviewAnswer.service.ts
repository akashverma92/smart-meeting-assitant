import { InterviewAnswerModel } from "./interviewAnswer.model";
import { AIContextRepository } from "../ai-context/aiContext.repository";

export class InterviewAnswerService {
  static async submitAnswer({
    meetingId,
    answer,
  }: {
    meetingId: string;
    answer: string;
  }) {
    const context = await AIContextRepository.findByMeetingId(meetingId);
    if (!context || !context.currentQuestion) {
      throw new Error("No active question found");
    }

    const record = await InterviewAnswerModel.create({
      meetingId,
      question: context.currentQuestion,
      answer,
      stage: context.stage,
    });

    return record;
  }
}
