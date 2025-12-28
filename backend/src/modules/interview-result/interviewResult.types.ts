export enum ResultStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export interface InterviewResultCreateInput {
  meetingId: string;
  finalScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: "Hire" | "Hold" | "Reject";
}
