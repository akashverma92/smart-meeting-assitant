// centeralized CORS configuration and secuirty headers config || controls wich frontend origins can access bacekdn
import cors, { CorsOptions } from "cors";
import { env } from "./env";

const corsOptions: CorsOptions = {
  origin: env.FRONTEND_URL, // http://localhost:3000
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export const corsMiddleware = cors(corsOptions);
