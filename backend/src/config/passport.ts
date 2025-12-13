// Oauth strategies configuration for user authentication using Passport.js 
// Google OAuth2 and GitHub OAuth strategies
// Defines how user information is serialized and deserialized for session management

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env";
import { AuthService } from "../modules/auth/auth.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0].value!;
        const name = profile.displayName;
        const avatar = profile.photos?.[0].value || "";

        const data = await AuthService.googleLogin({
          email,
          name,
          avatarUrl: avatar,
        });

        done(null, data);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
