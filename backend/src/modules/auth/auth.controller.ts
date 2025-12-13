// Handles HTTP request & response 
// NO bussiness logc here

import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export const AuthController = {
  async register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const data = await AuthService.register(username, email, password);
    res.status(201).json(data);
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const data = await AuthService.login(email, password);
    res.json(data);
  },
};
