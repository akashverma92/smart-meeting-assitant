import { User } from "@/src/types/user";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },

  async googleLogin(token: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) throw new Error("Google login failed");
    return res.json();
  },

  async getMe(token: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  },
};
