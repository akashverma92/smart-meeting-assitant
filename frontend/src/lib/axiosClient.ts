// D:\smart-meeting-assistant\frontend\src\lib\axiosClient.ts
import axios from "axios";
import { authService } from "../services/authService";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== "undefined"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : "http://localhost:3001/api",
  withCredentials: true, // send cookies with requests
});

// Flag to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await authService.refresh(); // Call your refresh endpoint
        isRefreshing = false;
        processQueue(null, null);
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
