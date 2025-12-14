import bcrypt from "bcryptjs";
import { AuthRepository } from "./auth.repository";
import { signToken } from "../../utils/jwt";

export const AuthService = {
  async register(username: string, email: string, password: string) {
    const exists = await AuthRepository.findByEmail(email);
    if (exists) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(password, 10);

    const user = await AuthRepository.createUser({
      username,
      email,
      password: hashed,
      authProvider: "email",
    });

    const token = signToken({ userId: user._id });
    return { user, token };
  },

  async login(email: string, password: string) {
    const user = await AuthRepository.findByEmail(email);
    if (!user || !user.password) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = signToken({ userId: user._id });
    return { user, token };
  },

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

    const token = signToken({ userId: user._id });
    return { user, token };
  },
};
