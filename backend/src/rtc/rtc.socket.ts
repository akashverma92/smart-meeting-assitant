// SDP exchange, ICE candidates
// WebRTC signaling logic
import { Server } from "socket.io";
import { registerSocketHandlers } from "./rtc.handlers";

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    registerSocketHandlers(io, socket);
  });
};
