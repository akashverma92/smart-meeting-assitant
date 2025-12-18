import { Request, Response, RequestHandler } from "express";
import { AuthService } from "./auth.service";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
} from "../../utils/auth-cookie";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { UserModel } from "../user/user.model";

export const AuthController = {
  /**
   * REGISTER
   */
  register: (async (req, res) => {
    const { username, email, password } = req.body;

    const { user, accessToken, refreshToken } =
      await AuthService.register(username, email, password);

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({ user });
  }) as RequestHandler,

  /**
   * LOGIN
   */
  login: (async (req, res) => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } =
      await AuthService.login(email, password);

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    res.json({ user });
  }) as RequestHandler,

  /**
   * CURRENT USER
   */
  me: (async (req, res) => {
    const authReq = req as AuthRequest;

    const user = await UserModel.findById(authReq.user?.userId).select(
      "-password -refreshToken"
    );

    res.json(user);
  }) as RequestHandler,

  /**
   * LOGOUT (invalidate refresh token)
   */
  logout: (async (req, res) => {
    const authReq = req as AuthRequest;

    if (authReq.user?.userId) {
      await UserModel.findByIdAndUpdate(authReq.user.userId, {
        refreshToken: null,
      });
    }

    clearAuthCookies(res);
    res.status(200).json({ message: "Logged out" });
  }) as RequestHandler,
};
