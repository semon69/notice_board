"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient, Notice } from "./api-client"

export function useNotices() {
  const queryClient = useQueryClient()

  // GET all notices
  const { data: notices, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const res = await apiClient.getNotices()
      if (!res.success) throw new Error(res.error)
      return res.data!
    },
  })

  // CREATE notice
  const createNoticeMutation = useMutation({
    mutationFn: async (notice: Notice) => {
      console.log('mutate here');
      const res = await apiClient.createNotice(notice)
      if (!res.success) throw new Error(res.error)
      return res.data!
    },
    onSuccess: (newNotice) => {
      // queryClient.setQueryData<Notice[]>(["notices"], (old) =>
      //   old ? [newNotice, ...old] : [newNotice]
      // )
      queryClient.invalidateQueries({ queryKey: ["notices"] })
    },
  })

  // UPDATE status
  const updateNoticeStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: string
    }) => {
      const res = await apiClient.toggleNoticeStatus(id, status)
      if (!res.success) throw new Error(res.error)
      return res.data!
    },
    onSuccess: (updated) => {
      // queryClient.setQueryData<Notice[]>(["notices"], (old) =>
      //   old?.map((n) => (n.id === updated.id ? updated : n)) ?? []
      // )
      queryClient.invalidateQueries({ queryKey: ["notices"] })
    },
  })

  // DELETE notice
  const deleteNoticeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.deleteNotice(id)
      if (!res.success) throw new Error(res.error)
      return id
    },
    onSuccess: (id) => {
      // queryClient.setQueryData<Notice[]>(["notices"], (old) =>
      //   old?.filter((n) => n.id !== id) ?? []
      // )
      queryClient.invalidateQueries({ queryKey: ["notices"] })
    },
  })

  return {
    // same API as before
    notices: notices,
    loading: isLoading,
    error: error?.message ?? null,

    fetchNotices: refetch,
    createNotice: createNoticeMutation.mutateAsync,
    updateNoticeStatus: (id: string, status: string) =>
      updateNoticeStatusMutation.mutateAsync({ id, status }),
    deleteNotice: deleteNoticeMutation.mutateAsync,
  }
}

