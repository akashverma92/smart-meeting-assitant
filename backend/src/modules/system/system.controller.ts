// Returns server, DB, uptime status
import { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel } from "../user/user.model";
import { MeetingModel } from "../meeting/meeting.model";

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

  async getDashboardStats(req: Request, res: Response) {
    try {
      const userCount = await UserModel.countDocuments({});
      const meetingCount = await MeetingModel.countDocuments({});
      const activeMeetings = await MeetingModel.countDocuments({
        state: { $ne: "COMPLETED" },
      });

      // Simple aggregation for chart data (last 7 days meetings)
      const last7Days = await MeetingModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Aggregate top users by interview count
      const topUsers = await MeetingModel.aggregate([
        {
          $group: {
            _id: "$createdBy",
            interviewCount: { $sum: 1 },
          },
        },
        { $sort: { interviewCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            username: "$user.username",
            email: "$user.email",
            avatarUrl: "$user.avatarUrl",
            interviewCount: 1,
          },
        },
      ]);

      res.status(200).json({
        totalUsers: userCount,
        totalInterviews: meetingCount,
        activeInterviews: activeMeetings,
        chartData: last7Days,
        topUsers,
      });
    } catch (error) {
      console.error("Stats Error:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  },
};
