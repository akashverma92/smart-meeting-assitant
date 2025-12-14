//Defines auth-related API routes for Login, registration, oath, callbacks
import { Router } from "express";
import passport from "passport";
import { AuthController } from "./auth.controller";
import { signToken } from "../../utils/jwt";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { token } = req.user as any;
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard?token=${token}`);
  }
);

export default router;

