import express, { type Router } from "express"
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNoticeStatus,
  updateNotice,
  deleteNotice,
  getNoticeStats,
} from "../controllers/noticeController"
import { validateRequest } from "../middleware/validateRequest"
import { createNoticeZod } from "../validation/noticeValidation"
import { upload } from "../middleware/upload"

const router: Router = express.Router()

// Routes
router.post("/create", validateRequest(createNoticeZod), createNotice)
router.get("/", getAllNotices)
router.get("/stats", getNoticeStats)
router.get("/:id", getNoticeById)
router.patch("/:id/status", updateNoticeStatus)
router.put("/:id", updateNotice)
router.delete("/:id", deleteNotice)

export default router
