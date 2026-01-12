import mongoose from "mongoose"

export const connectDB = async (): Promise<boolean> => {
  try {
    const mongoURI: string = process.env.MONGODB_URI || "mongodb://localhost:27017/notice-board"

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions)

    console.log("MongoDB connected successfully")
    return true
  } catch (error) {
    console.error("MongoDB connection error:", error instanceof Error ? error.message : error)
    throw error
  }
}
