import cors from "cors"

const corsMiddleware = cors({
  origin: true, // <-- IMPORTANT
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
})

export default corsMiddleware
