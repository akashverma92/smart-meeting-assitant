import http from "http";
import app from "./app";
import { connectDB } from "./database/mongo.connection";
import { env } from "./config/env";
import { initSocket } from "./rtc/rtc.socket";

const server = http.createServer(app);
initSocket(server);

connectDB().then(() => {
  server.listen(env.PORT, () => {
    console.log(`Backend running on port ${env.PORT}`);
  });
});
