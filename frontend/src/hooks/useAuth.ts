"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { loginUser, registerUser, fetchMe, logout } from "@/redux/slices/userSlice";
import { authService } from "@/src/services/authService";
import { unwrapResult } from "@reduxjs/toolkit";

import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";


export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading, error } = useSelector((state: RootState) => state.user);

  const login = async (emailOrData: string | { email: string; password: string }, password?: string) => {
    const data = typeof emailOrData === 'string' ? { email: emailOrData, password: password! } : emailOrData;
    try {
      const resultAction = await dispatch(loginUser(data));
      const result = unwrapResult(resultAction);
      console.log("useAuth SUCCESS payload:", result);
      return result;
    } catch (e) {
      console.error("useAuth FAILS:", e);
      throw e;
    }
  };
  const register = (data: { username: string; email: string; password: string }) => dispatch(registerUser(data)).unwrap();
  const googleLogin = () => window.location.href = authService.googleAuthUrl();
  const fetchUser = () => dispatch(fetchMe());
  const logoutUser = () => { dispatch(logout()); router.replace('/'); };

  // ✅ Auto-fetch user on first load if cookies exist
  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user]);

  return { user, loading, error, login, register, googleLogin, fetchUser, logoutUser };
};
