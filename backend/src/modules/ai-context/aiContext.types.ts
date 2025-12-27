export enum InterviewStage {
  INTRO = "INTRO",
  RESUME_BASED = "RESUME_BASED",
  TECHNICAL = "TECHNICAL",
  BEHAVIORAL = "BEHAVIORAL",
  WRAP_UP = "WRAP_UP",
}

export interface AskedQuestion {
  question: string;
  stage: InterviewStage;
  askedAt: Date;
}

export interface AIContextCreateInput {
  meetingId: string;
  resumeId?: string;
  skills?: string[];
}
