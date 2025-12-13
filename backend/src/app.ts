import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/api", routes);

export default app;
