import http from "http";
import app from "./app";
import { connectDB } from "./database/mongo.connection";
import { env } from "./config/env";

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(env.PORT, () => {
    console.log(`Backend running on port ${env.PORT}`);
  });
});
