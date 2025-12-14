import { Router } from "express";
import passport from "passport";
import { AuthController } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { setAuthCookie } from "../../utils/auth-cookie";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
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
    setAuthCookie(res, token);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

export default router;
