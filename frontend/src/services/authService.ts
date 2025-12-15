import { api } from "../lib/axiosClient";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  login: (data: LoginData) => api.post("/auth/v1/login", data),
  register: (data: RegisterData) => api.post("/auth/v1/register", data),
  me: () => api.get("/auth/v1/me"),
  logout: () => api.post("/auth/v1/logout"),
  googleAuthUrl: () => `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/v1/google`,
};
