export type ParticipantRole = "AI" | "CANDIDATE" | "HUMAN";

export interface JoinMeetingPayload {
  meetingId: string;
  role: ParticipantRole;
}

export interface UserAnswerPayload {
  meetingId: string;
  answer: string;
}

export interface HumanQuestionPayload {
  meetingId: string;
  question: string;
}
