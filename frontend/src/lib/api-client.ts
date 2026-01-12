const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface Notice {
  id?: string
  targetDepartment: string
  noticeTitle: string
  selectedEmployee: any
  noticeType: string[]
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
  // api-client.ts
  async createNotice(notice: Notice): Promise<ApiResponse<Notice>> {
    try {
      const response = await fetch(`${this.baseUrl}/notices/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notice), // send plain JSON
      })

      if (!response.ok) {
        throw new Error(`Failed to create notice: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create notice",
      }
    }
  }


  async getNotices(): Promise<any> {
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
}

export const apiClient = new ApiClient()
