import { Response } from "express";

const COOKIE_NAME = "access_token";

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000, 
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME);
};
