// Allowed state transitions for meetings

import { MeetingState } from "./meeting.state";

const allowedTransitions: Record<MeetingState, MeetingState[]> = {
  [MeetingState.MEETING_CREATED]: [
    MeetingState.AI_JOINED,
  ],

  [MeetingState.AI_JOINED]: [
    MeetingState.WAITING_FOR_RESUME,
  ],

  [MeetingState.WAITING_FOR_RESUME]: [
    MeetingState.RESUME_UPLOADED,
    MeetingState.CANCELLED,
  ],

  [MeetingState.RESUME_UPLOADED]: [
    MeetingState.RESUME_ANALYZED,
  ],

  [MeetingState.RESUME_ANALYZED]: [
    MeetingState.PREPARATION_TIME,
  ],

  [MeetingState.PREPARATION_TIME]: [
    MeetingState.INTERVIEW_STARTED,
  ],

  [MeetingState.INTERVIEW_STARTED]: [
    MeetingState.INTERVIEW_IN_PROGRESS,
  ],

  [MeetingState.INTERVIEW_IN_PROGRESS]: [
    MeetingState.COMPLETED,
  ],

  [MeetingState.COMPLETED]: [],
  [MeetingState.CANCELLED]: [],
};

export function canTransition(
  from: MeetingState,
  to: MeetingState
): boolean {
  return allowedTransitions[from]?.includes(to);
}

export function assertTransition(
  from: MeetingState,
  to: MeetingState
): void {
  if (!canTransition(from, to)) {
    throw new Error(
      `Invalid meeting state transition: ${from} → ${to}`
    );
  }
}
