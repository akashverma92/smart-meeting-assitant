import { Schema, model, Types, Document } from "mongoose";
import { MeetingState } from "./meeting.state";

// Meeting schema definition

const MeetingSchema = new Schema(
  {
    meetingCode: {
      type: String,
      required: true,
      unique: true,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    state: {
      type: String,
      enum: Object.values(MeetingState),
      default: MeetingState.MEETING_CREATED,
    },

    resumeId: {
      type: Types.ObjectId,
      ref: "Resume",
      default: null,
    },

    aiJoined: {
      type: Boolean,
      default: false,
    },

    preparationEndsAt: {
      type: Date,
      default: null,
    },

    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
);

export interface IMeeting extends Document {
  meetingCode: string;
  createdBy: Types.ObjectId;
  state: MeetingState;
  resumeId?: Types.ObjectId;
  aiJoined: boolean;
  preparationEndsAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const MeetingModel = model<IMeeting>("Meeting", MeetingSchema);
