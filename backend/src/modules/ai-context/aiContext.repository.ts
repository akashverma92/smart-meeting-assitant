import { AIContextModel } from "./aiContext.model";

export class AIContextRepository {
  static async create(data: any) {
    return AIContextModel.create(data);
  }

  static async findByMeetingId(meetingId: string) {
    return AIContextModel.findOne({ meetingId });
  }

  static async update(meetingId: string, update: any) {
    return AIContextModel.findOneAndUpdate(
      { meetingId },
      update,
      { new: true }
    );
  }

  static async pushAskedQuestion(
    meetingId: string,
    question: string,
    stage: string
  ) {
    return AIContextModel.findOneAndUpdate(
      { meetingId },
      {
        $push: {
          askedQuestions: {
            question,
            stage,
            askedAt: new Date(),
          },
        },
        currentQuestion: question,
      },
      { new: true }
    );
  }
}
