"use client"

import { useCallback, useState } from "react"
import { apiClient, type Notice, type Employee } from "./api-client"

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotices = useCallback(async () => {
    setLoading(true)
    setError(null)
    const response = await apiClient.getNotices()
    if (response.success && response.data) {
      setNotices(response.data)
    } else {
      setError(response.error || "Failed to fetch notices")
    }
    setLoading(false)
  }, [])

  const createNotice = useCallback(async (notice: Notice) => {
    setLoading(true)
    setError(null)
    const response = await apiClient.createNotice(notice)
    if (response.success && response.data) {
      setNotices((prev) => [response.data!, ...prev])
      return response.data
    } else {
      setError(response.error || "Failed to create notice")
      return null
    }
    setLoading(false)
  }, [])

  const updateNoticeStatus = useCallback(async (id: string, status: string) => {
    const response = await apiClient.toggleNoticeStatus(id, status)
    if (response.success && response.data) {
      setNotices((prev) => prev.map((n) => (n.id === id ? response.data! : n)))
      return response.data
    } else {
      setError(response.error || "Failed to update notice")
      return null
    }
  }, [])

  const deleteNotice = useCallback(async (id: string) => {
    const response = await apiClient.deleteNotice(id)
    if (response.success) {
      setNotices((prev) => prev.filter((n) => n.id !== id))
      return true
    } else {
      setError(response.error || "Failed to delete notice")
      return false
    }
  }, [])

  return {
    notices,
    loading,
    error,
    fetchNotices,
    createNotice,
    updateNoticeStatus,
    deleteNotice,
  }
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    const response = await apiClient.getEmployees()
    if (response.success && response.data) {
      setEmployees(response.data)
    } else {
      setError(response.error || "Failed to fetch employees")
    }
    setLoading(false)
  }, [])

  return {
    employees,
    loading,
    error,
    fetchEmployees,
  }
}
