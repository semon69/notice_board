import express, { type Express, type Request, type Response, type NextFunction } from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { connectDB } from "../src/config/database"
import corsMiddleware from "../src/middleware/corsMiddleware"
import errorHandler from "../src/middleware/errorHandler"
import noticeRoutes from "../src/routes/noticeRoutes"

dotenv.config()

const app: Express = express()

// Middleware
app.use(corsMiddleware)
app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }))

// Connect to Database
let dbConnected = false

const initializeDB = async (): Promise<void> => {
  if (!dbConnected) {
    try {
      await connectDB()
      dbConnected = true
    } catch (error) {
      console.error("Database connection failed:", error)
      dbConnected = false
    }
  }
}

// Health Check Route
app.get("/health", (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    database: dbConnected ? "connected" : "disconnected",
  })
})

// API Routes
app.use(
  "/api/notices",
  async (req: Request, res: Response, next: NextFunction) => {
    await initializeDB()
    next()
  },
  noticeRoutes,
)

// 404 Handler
app.use((req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Error Handler
app.use(errorHandler)

// Start Server
const PORT: number = Number.parseInt(process.env.PORT || "3001", 10)

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, async (): Promise<void> => {
    console.log(`Server running on port ${PORT}`)
    await initializeDB()
  })
}

export default app
