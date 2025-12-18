// D:\smart-meeting-assistant\frontend\src\services\authService.ts
import { api } from "../lib/axiosClient";

export const authService = {
  login: (data: { email: string; password: string }) => api.post("/auth/v1/login", data),
  register: (data: { username: string; email: string; password: string }) => api.post("/auth/v1/register", data),
  me: () => api.get("/auth/v1/me"),
  logout: () => api.post("/auth/v1/logout"),
  refresh: () => api.post("/auth/v1/refresh"), // 🔹 refresh token endpoint
  googleAuthUrl: () => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== "undefined"
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://localhost:3001";
    return `${baseUrl}/api/auth/v1/google`;
  },
};
