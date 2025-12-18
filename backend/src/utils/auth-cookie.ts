import { Response } from "express";

const isProd = process.env.NODE_ENV === "production";

export const setAccessTokenCookie = (res: Response, token: string) => {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 30 * 60 * 1000, // 30 minutes
  });
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict", // 🔒 stronger protection
    path: "/api/auth/v1/refresh", // 🔒 only sent to refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token", {
    path: "/api/auth/v1/refresh",
  });
};
