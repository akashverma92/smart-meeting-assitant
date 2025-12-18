import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  userId: string;
}

/**
 * Access Token – short lived (30m)
 */
export const signAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || "30min",
  } as SignOptions);
};

/**
 * Refresh Token – long lived (7d / 30d)
 */
export const signRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN || "7d",
  } as SignOptions);
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};


