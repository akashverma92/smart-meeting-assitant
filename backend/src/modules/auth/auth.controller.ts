import { Request, Response, RequestHandler } from "express";
import { AuthService } from "./auth.service";
import { setAuthCookie, clearAuthCookie } from "../../utils/auth-cookie";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { UserModel } from "../user/user.model";

export const AuthController = {
  register: (async (req, res) => {
    const { username, email, password } = req.body;

    const { user, token } = await AuthService.register(
      username,
      email,
      password
    );

    setAuthCookie(res, token);
    res.status(201).json({ user });
  }) as RequestHandler,

  login: (async (req, res) => {
    const { email, password } = req.body;

    const { user, token } = await AuthService.login(email, password);

    setAuthCookie(res, token);
    res.json({ user });
  }) as RequestHandler,

  me: (async (req, res) => {
    const authReq = req as AuthRequest;

    const user = await UserModel.findById(authReq.user?.userId).select(
      "-password"
    );

    res.json(user);
  }) as RequestHandler,

  logout: ((_, res) => {
    clearAuthCookie(res);
    res.status(200).json({ message: "Logged out" });
  }) as RequestHandler,
};
