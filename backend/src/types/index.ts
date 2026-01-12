export interface INotice {
  _id?: string
  noticeTitle: string
  noticeType: string[]
  noticeBody: string
  targetDepartment: string
  selectedEmployee?: {
    employeeId: string
    employeeName: string
    employeePosition: string
  }
  publishDate: Date
  categories: string[]
  attachment?: {
    fileName: string
    fileUrl: string
  }
  status: "draft" | "published"
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface IEmployee {
  _id?: string
  employeeId: string
  employeeName: string
  employeePosition: string
  department: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface PaginationData {
  total: number
  page: number
  limit: number
  pages: number
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  pagination?: PaginationData
}
