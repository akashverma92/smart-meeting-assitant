// MongoDb connecftion logic 
// Handles connection reteris & errores 
import mongoose from "mongoose";
import { env } from "../config/env";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
};
