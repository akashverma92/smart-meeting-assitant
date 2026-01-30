import { Router } from "express";
import passport from "passport";
import { AuthController } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../../utils/auth-cookie";

import { authRateLimiter } from "../../middlewares/rateLimit.middleware";

import { validate } from "../../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "./auth.validation";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), AuthController.register);
router.post("/login", authRateLimiter, validate(loginSchema), AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refresh);
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
    const { accessToken, refreshToken, user } = req.user;
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    const redirectUrl = user.role === "admin"
      ? `${process.env.FRONTEND_URL}/admin/dashboard`
      : `${process.env.FRONTEND_URL}/dashboard`;

    res.redirect(redirectUrl);
  }
);

export default router;