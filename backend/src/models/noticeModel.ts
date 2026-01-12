import mongoose, { Schema } from "mongoose"
import type { INotice } from "../types"


const noticeSchema = new Schema<INotice>(
  {
    noticeTitle: {
      type: String,
      required: true,
      trim: true,
    },
    noticeType: {
      type: [String],
      enum: [
        "General / Company-A",
        "Holiday & Event",
        "HR & Policy Update",
        "Warning / Disciplinary",
        "Performance Improvement",
        "Appreciation / Recognito",
        "Attendance / Leave Issue",
        "Payroll / Compensation",
        "Contract / Role Update",
        "Advisory / Personal Reminder",
      ],
      required: true,
    },
    noticeBody: {
      type: String,
      required: false,
    },
    targetDepartment: {
      type: String,
      enum: ["Individual", "IT", "HR", "Finance", "Operations", "Marketing", "Sales"],
      required: true,
    },
    selectedEmployee: {
      employeeId: String,
      employeeName: String,
      employeePosition: String,
    },
    publishDate: {
      type: Date,
      required: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    attachment: {
      fileName: String,
      fileUrl: String,
    },
    status: {
      type: String,
      enum: ["draft", "published", 'unpublished'],
      default: "draft",
    },
    createdBy: {
      type: String,
      default: "Admin",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

const Notice = mongoose.model<INotice>("Notice", noticeSchema)

export default Notice
