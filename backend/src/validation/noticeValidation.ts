import { z } from "zod"

export const noticeTypeEnum = [
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
] as const

export const targetDepartmentEnum = [
    "Individual",
    "IT",
    "HR",
    "Finance",
    "Operations",
    "Marketing",
    "Sales",
] as const

export const noticeStatusEnum = ["draft", "published", "unpublished"] as const

export const noticeZodSchema = z.object({
    noticeTitle: z.string().min(1, "Title is required"),
    noticeType: z
        .array(z.enum(noticeTypeEnum))
        .min(1, "Please select at least one notice type"),

    noticeBody: z.string().optional(),
    targetDepartment: z.enum(targetDepartmentEnum),

    selectedEmployee: z
        .object({
            employeeId: z.string().optional(),
            employeeName: z.string().optional(),
            employeePosition: z.string().optional(),
        })
        .optional(),

    publishDate: z.coerce.date(),

    categories: z.array(z.string()).optional(),

    attachment: z
        .object({
            fileName: z.string().optional(),
            fileUrl: z.string().url("Invalid file URL").optional(),
        })
        .optional(),

    status: z.enum(noticeStatusEnum).optional(),
    createdBy: z.string().optional(),
})

// Create Notice
export const createNoticeZod = noticeZodSchema

// Update Notice (all fields optional)
export const updateNoticeZod = noticeZodSchema.partial()
