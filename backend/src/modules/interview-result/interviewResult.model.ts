import { Schema, model, Types } from "mongoose";
import { ResultStatus } from "./interviewResult.types";

const InterviewResultSchema = new Schema(
  {
    meetingId: {
      type: Types.ObjectId,
      ref: "Meeting",
      required: true,
      unique: true,
    },

    finalScore: {
      type: Number,
      required: true,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    recommendation: {
      type: String,
      enum: ["Hire", "Hold", "Reject"],
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ResultStatus),
      default: ResultStatus.DRAFT,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const InterviewResultModel = model(
  "InterviewResult",
  InterviewResultSchema
);
