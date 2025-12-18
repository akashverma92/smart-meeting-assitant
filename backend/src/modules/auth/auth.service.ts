import bcrypt from "bcryptjs";
import { AuthRepository } from "./auth.repository";
import {
  signAccessToken,
  signRefreshToken,
} from "../../utils/jwt";
import { RefreshTokenModel } from "./auth.schema";

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
};
