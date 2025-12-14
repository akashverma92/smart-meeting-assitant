import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";

import "./config/passport";
import { corsMiddleware } from "./config/cors";
import routes from "./routes";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api", routes);

export default app;
