import type { Request, Response } from "express"
import Notice from "../models/noticeModel"
import type { INotice, ApiResponse } from "../types"

// Create Notice
export const createNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      noticeTitle,
      noticeType,
      noticeBody,
      targetDepartment,
      selectedEmployee,
      publishDate,
      categories,
      attachment,
      status,
    }: INotice = req.body

    // Validation
    if (!noticeTitle || !noticeType || !noticeBody || !targetDepartment || !publishDate) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      } as ApiResponse)
      return
    }

    const newNotice = new Notice({
      noticeTitle,
      noticeType,
      noticeBody,
      targetDepartment,
      selectedEmployee: selectedEmployee || null,
      publishDate: new Date(publishDate),
      categories: categories || [],
      attachment: attachment || null,
      status: status || "draft",
    })

    await newNotice.save()

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: newNotice,
    } as ApiResponse)
  } catch (error) {
    console.error("Error creating notice:", error)
    res.status(500).json({
      success: false,
      message: "Error creating notice",
      error: error instanceof Error ? error.message : String(error),
    } as ApiResponse)
  }
}

// Get All Notices with Filtering
export const getAllNotices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, targetDepartment, search, page = "1", limit = "10" } = req.query

    const filter: any = {}

    // Filter by status (draft/published)
    if (status) {
      filter.status = status
    }

    // Filter by department
    if (targetDepartment && targetDepartment !== "all") {
      filter.targetDepartment = targetDepartment
    }

    // Search by title or notice type
    if (search) {
      filter.$or = [{ title: { $regex: search, $options: "i" } }, { noticeType: { $regex: search, $options: "i" } }]
    }

    const pageNum = Number.parseInt(page as string)
    const limitNum = Number.parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const notices = await Notice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum)

    const totalNotices = await Notice.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: notices,
      pagination: {
        total: totalNotices,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(totalNotices / limitNum),
      },
    } as ApiResponse)
  } catch (error) {
    console.error("Error fetching notices:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching notices",
      error: error instanceof Error ? error.message : String(error),
    } as ApiResponse)
  }
}

// Get Single Notice
export const getNoticeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      } as ApiResponse)
      return
    }

    const notice = await Notice.findById(id)

    if (!notice) {
      res.status(404).json({
        success: false,
        message: "Notice not found",
      } as ApiResponse)
      return
    }

    res.status(200).json({
      success: true,
      data: notice,
    } as ApiResponse)
  } catch (error) {
    console.error("Error fetching notice:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching notice",
      error: error instanceof Error ? error.message : String(error),
    } as ApiResponse)
  }
}

// Update Notice Status (Publish/Unpublish)
export const updateNoticeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      } as ApiResponse)
      return
    }

    if (!["draft", "published", "unpublished"].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid status. Must be unpublished or published",
      } as ApiResponse)
      return
    }

    const updatedNotice = await Notice.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true })

    if (!updatedNotice) {
      res.status(404).json({
        success: false,
        message: "Notice not found",
      } as ApiResponse)
      return
    }

    res.status(200).json({
      success: true,
      message: `Notice ${status} successfully`,
      data: updatedNotice,
    } as ApiResponse)
  } catch (error) {
    console.error("Error updating notice status:", error)
    res.status(500).json({
      success: false,
      message: "Error updating notice status",
      error: error instanceof Error ? error.message : String(error),
    } as ApiResponse)
  }
}

// Update Notice
export const updateNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updateData = req.body

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      } as ApiResponse)
      return
    }

    const updatedNotice = await Notice.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true })

    if (!updatedNotice) {
      res.status(404).json({
        success: false,
        message: "Notice not found",
      } as ApiResponse)
      return
    }

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: updatedNotice,
    } as ApiResponse)
  } catch (error) {
    console.error("Error updating notice:", error)
    res.status(500).json({
      success: false,
      message: "Error updating notice",
      error: error instanceof Error ? error.message : String(error),
    } as ApiResponse)
  }
}

// Delete Notice
export const deleteNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      } as ApiResponse)
      return
    }

    const deletedNotice = await Notice.findByIdAndDelete(id)

    if (!deletedNotice) {
      res.status(404).json({
        success: false,
        message: "Notice not found",
      } as ApiResponse)
      return
    }

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
      data: deletedNotice,
    } as ApiResponse)
  } catch (error) {
    console.error("Error deleting notice:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting notice",
      error: error instanceof Error ? error.message : String(error),
    } as ApiResponse)
  }
}

// Get Stats
export const getNoticeStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalNotices = await Notice.countDocuments()
    const publishedNotices = await Notice.countDocuments({ status: "published" })
    const draftNotices = await Notice.countDocuments({ status: "draft" })

    res.status(200).json({
      success: true,
      data: {
        total: totalNotices,
        published: publishedNotices,
        draft: draftNotices,
      },
    } as ApiResponse)
  } catch (error) {
    console.error("Error fetching stats:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
      error: error instanceof Error ? error.message : String(error),
    } as ApiResponse)
  }
}
