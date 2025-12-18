import { Router } from "express";
import passport from "passport";
import { AuthController } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { setAccessTokenCookie } from "../../utils/auth-cookie";

import { authRateLimiter } from "../../middlewares/rateLimit.middleware";

const router = Router();

router.post("/register", authRateLimiter, AuthController.register);
router.post("/login", authRateLimiter, AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/me", requireAuth, AuthController.me);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // @ts-ignore
    const { token } = req.user;
    setAccessTokenCookie(res, token);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

export default router;
