import bcrypt from "bcryptjs";
import { AuthRepository } from "./auth.repository";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { RefreshTokenModel } from "./auth.schema";
import { RefreshTokenRepository } from "./refreshToken.repository";

/**
 * Remove sensitive fields before returning user
 */
const sanitizeUser = (user: any) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

export const AuthService = {
  /**
   * Email + Password Registration
   */
  async register(username: string, email: string, password: string) {
    const exists = await AuthRepository.findByEmail(email);
    if (exists) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(password, 10);

    const user = await AuthRepository.createUser({
      username,
      email,
      password: hashed,
      authProvider: "email",
      isEmailVerified: false,
    });

    const accessToken = signAccessToken({
      userId: user._id.toString(),
    });

    const refreshToken = signRefreshToken({
      userId: user._id.toString(),
    });

    await RefreshTokenModel.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      ),
    });

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  },

  /**
   * Email + Password Login
   */
  async login(email: string, password: string) {
    const user = await AuthRepository.findByEmail(email);
    if (!user || !user.password) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = signAccessToken({
      userId: user._id.toString(),
    });

    const refreshToken = signRefreshToken({
      userId: user._id.toString(),
    });

    await RefreshTokenModel.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  },

  /**
   * Google OAuth Login
   */
  async googleLogin(profile: {
    email: string;
    name: string;
    avatarUrl: string;
  }) {
    let user = await AuthRepository.findByEmail(profile.email);

    if (!user) {
      user = await AuthRepository.createUser({
        username: profile.name,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
        authProvider: "google",
        isEmailVerified: true,
      });
    }

    const accessToken = signAccessToken({
      userId: user._id.toString(),
    });

    const refreshToken = signRefreshToken({
      userId: user._id.toString(),
    });

    await RefreshTokenModel.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  },
  async refresh(refreshToken: string) {
    // 1. Verify refresh token JWT
    const payload = verifyRefreshToken(refreshToken);

    // 2. Check token in DB
    const storedToken = await RefreshTokenRepository.findValid(refreshToken);
    if (!storedToken) {
      throw new Error("Invalid refresh token");
    }

    // 3. Revoke old refresh token (rotation)
    await RefreshTokenRepository.revoke(refreshToken);

    // 4. Issue new tokens
    const newAccessToken = signAccessToken({
      userId: payload.userId,
    });

    const newRefreshToken = signRefreshToken({
      userId: payload.userId,
    });

    // 5. Store new refresh token
    await RefreshTokenRepository.create(
      payload.userId,
      newRefreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

};
