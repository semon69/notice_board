const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"

export interface Notice {
  id?: string
  targetDepartment: string
  noticeTitle: string
  employeeId: string
  employeeName: string
  position: string
  noticeType: string
  publishDate: string
  noticeBody: string
  categories: string[]
  attachments: File[] | string[]
  status: "published" | "draft" | "unpublished"
  createdAt?: string
}

export interface Employee {
  id: string
  name: string
  email: string
  position: string
  department: string
  designation: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("API Error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  // Notices API
  async createNotice(notice: Notice): Promise<ApiResponse<Notice>> {
    const formData = new FormData()
    formData.append("targetDepartment", notice.targetDepartment)
    formData.append("noticeTitle", notice.noticeTitle)
    formData.append("employeeId", notice.employeeId)
    formData.append("employeeName", notice.employeeName)
    formData.append("position", notice.position)
    formData.append("noticeType", notice.noticeType)
    formData.append("publishDate", notice.publishDate)
    formData.append("noticeBody", notice.noticeBody)
    formData.append("categories", JSON.stringify(notice.categories))
    formData.append("status", notice.status)

    // Add attachments
    if (notice.attachments && notice.attachments.length > 0) {
      notice.attachments.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`attachments[${index}]`, file)
        }
      })
    }

    try {
      const response = await fetch(`${this.baseUrl}/notices`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to create notice: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to create notice" }
    }
  }

  async getNotices(): Promise<ApiResponse<Notice[]>> {
    return this.request<Notice[]>("/notices", { method: "GET" })
  }

  async getNoticeById(id: string): Promise<ApiResponse<Notice>> {
    return this.request<Notice>(`/notices/${id}`, { method: "GET" })
  }

  async updateNotice(id: string, notice: Partial<Notice>): Promise<ApiResponse<Notice>> {
    return this.request<Notice>(`/notices/${id}`, {
      method: "PUT",
      body: JSON.stringify(notice),
    })
  }

  async deleteNotice(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/notices/${id}`, { method: "DELETE" })
  }

  async toggleNoticeStatus(id: string, status: string): Promise<ApiResponse<Notice>> {
    return this.request<Notice>(`/notices/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  // Employees API
  async getEmployees(): Promise<ApiResponse<Employee[]>> {
    return this.request<Employee[]>("/employees", { method: "GET" })
  }

  async getEmployeeById(id: string): Promise<ApiResponse<Employee>> {
    return this.request<Employee>(`/employees/${id}`, { method: "GET" })
  }

  async getDepartments(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>("/departments", { method: "GET" })
  }
}

export const apiClient = new ApiClient()
