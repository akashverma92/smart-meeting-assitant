import { InterviewResultModel } from "./interviewResult.model";
import { InterviewAnswerModel } from "../interviwer/interviewAnswer.model";
import { ResultStatus } from "./interviewResult.types";

export class InterviewResultService {
  static async generateResult(meetingId: string) {
    const answers = await InterviewAnswerModel.find({ meetingId });

    if (!answers.length) {
      throw new Error("No answers available for evaluation");
    }

    const avgScore =
      answers.reduce((sum, a) => sum + (a.aiScore || 0), 0) /
      answers.length;

    const strengths = answers
      .filter(a => (a.aiScore ?? 0) >= 7)
      .map(a => a.question);

    const weaknesses = answers
      .filter(a => (a.aiScore ?? 0) < 7)
      .map(a => a.question);

    let recommendation: "Hire" | "Hold" | "Reject" = "Hold";

    if (avgScore >= 8) recommendation = "Hire";
    else if (avgScore < 5) recommendation = "Reject";

    return InterviewResultModel.create({
      meetingId,
      finalScore: avgScore,
      strengths,
      weaknesses,
      recommendation,
    });
  }

  static async publishResult(meetingId: string) {
    return InterviewResultModel.findOneAndUpdate(
      { meetingId },
      {
        status: ResultStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      { new: true }
    );
  }
}
