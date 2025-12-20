import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";

import helmet from "helmet";
import "./config/passport";
import "./types/express-augment";
import { corsMiddleware } from "./config/cors";
import routes from "./routes";

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api", routes);

export default app;
