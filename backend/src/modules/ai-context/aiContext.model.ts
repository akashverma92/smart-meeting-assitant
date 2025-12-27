import { Schema, model, Types } from "mongoose";
import { InterviewStage } from "./aiContext.types";

const AIContextSchema = new Schema(
  {
    meetingId: {
      type: Types.ObjectId,
      ref: "Meeting",
      required: true,
      unique: true,
    },

    resumeId: {
      type: Types.ObjectId,
      ref: "Resume",
      default: null,
    },

    stage: {
      type: String,
      enum: Object.values(InterviewStage),
      default: InterviewStage.INTRO,
    },

    skills: {
      type: [String],
      default: [],
    },

    askedQuestions: [
      {
        question: String,
        stage: String,
        askedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    currentQuestion: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const AIContextModel = model("AIContext", AIContextSchema);
