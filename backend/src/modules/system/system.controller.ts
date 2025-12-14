// Returns server, DB, uptime status
import { Request, Response } from "express";
import mongoose from "mongoose";

export const SystemController = {
  async health(req: Request, res: Response) {
    // Basic checks
    const dbState = mongoose.connection.readyState; 
    const dbStatus =
      dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "disconnected";

    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      db: dbStatus,
      uptime: process.uptime(),
    });
  },
};
