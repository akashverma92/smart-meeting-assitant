// database schema for stroing the interview answers
import { Schema, model, Types } from "mongoose";
import { InterviewStage } from "../ai-context/aiContext.types";

const InterviewAnswerSchema = new Schema(
  {
    meetingId: {
      type: Types.ObjectId,
      ref: "Meeting",
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    stage: {
      type: String,
      enum: Object.values(InterviewStage),
      required: true,
    },

    score: {
      type: Number,
      default: null, // for future AI scoring
    },

    feedback: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const InterviewAnswerModel = model(
  "InterviewAnswer",
  InterviewAnswerSchema
);
