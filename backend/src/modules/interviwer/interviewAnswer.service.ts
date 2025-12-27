import { InterviewAnswerModel } from "./interviewAnswer.model";
import { AIContextRepository } from "../ai-context/aiContext.repository";
import { AIEvaluationService } from "./aiEvaluation.service";

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

    // 1️⃣ AI evaluates the answer
    const evaluation = AIEvaluationService.evaluate(answer);

    // 2️⃣ Save answer + AI evaluation
    const record = await InterviewAnswerModel.create({
      meetingId,
      question: context.currentQuestion,
      answer,
      stage: context.stage,
      aiScore: evaluation.score,
      aiFeedback: evaluation.feedback,
    });

    return record;
  }
}
