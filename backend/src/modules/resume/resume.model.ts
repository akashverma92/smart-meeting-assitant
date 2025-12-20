// store the resume meta data

import { Schema, model, Types } from "mongoose";

const ResumeSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    meetingId: {
      type: Types.ObjectId,
      ref: "Meeting",
      required: true,
      unique: true, 
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      enum: ["pdf", "docx"],
      required: true,
    },

    rawText: {
      type: String,
      required: true,
    },

    parsedData: {
      type: Schema.Types.Mixed,
      default: {},
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const ResumeModel = model("Resume", ResumeSchema);
