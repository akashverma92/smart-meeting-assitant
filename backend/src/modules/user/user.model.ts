import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  authProvider: "email" | "google";
  avatarUrl?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String },
    authProvider: { type: String, enum: ["email", "google"], required: true },
    avatarUrl: { type: String },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
