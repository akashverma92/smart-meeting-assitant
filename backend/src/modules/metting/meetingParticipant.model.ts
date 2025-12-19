// Tracks AI , candidate , interviwer role per meeting
import { Schema, model, Types } from "mongoose";

export enum MeetingRole {
  AI = "AI",
  CANDIDATE = "CANDIDATE",
  INTERVIEWER = "INTERVIEWER",
}

const MeetingParticipantSchema = new Schema(
  {
    meetingId: {
      type: Types.ObjectId,
      ref: "Meeting",
      required: true,
    },

    userId: {
      type: Types.ObjectId,
      ref: "User",
      default: null, // null for AI
    },

    role: {
      type: String,
      enum: Object.values(MeetingRole),
      required: true,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    leftAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const MeetingParticipantModel = model(
  "MeetingParticipant",
  MeetingParticipantSchema
);
