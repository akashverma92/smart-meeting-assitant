import { ResumeModel } from "./resume.model";

export class ResumeRepository {
  static async create(data: any) {
    return ResumeModel.create(data);
  }

  static async findByMeetingId(meetingId: string) {
    return ResumeModel.findOne({ meetingId });
  }

  static async updateParsedData(resumeId: string, parsedData: any) {
    return ResumeModel.findByIdAndUpdate(
      resumeId,
      { parsedData },
      { new: true }
    );
  }
}
