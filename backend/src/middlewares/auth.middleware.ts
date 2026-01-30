import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const requireAuth: RequestHandler = (
  req,
  res,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    (req as AuthRequest).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

import { UserModel } from "../modules/user/user.model";

export const requireAdmin: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  const authReq = req as AuthRequest;
  if (!authReq.user?.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await UserModel.findById(authReq.user.userId);
    if (!user || user.role !== "admin") {
      res.status(403).json({ message: "Forbidden: Admin access required" });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error during role check" });
  }
};
