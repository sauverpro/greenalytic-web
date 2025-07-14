import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/api/axios"
import type {  ApiResponse } from "@/types"

interface PaginationParams {
  page: number;
  limit: number;
}

export const usePaginatedData = <T>(
  key: string,
  endpoint: string,
  { page, limit }: PaginationParams
) => {
  return useQuery<T>({
    queryKey: [key, page, limit],
    queryFn: async () => {
      const response = await apiClient.get(endpoint, {
        params: { page, limit },
      });
      return response.data;
    },

  });
};



export function useDynamicCrud<T>() {
  const queryClient = useQueryClient()

  const fetchData = (url: string, queryKey: string, params: PaginationParams) => {
    // Better query key structure - avoid JSON.stringify issues
    const normalizedParams = {
      page: Number(params.page) || 1,
      limit: Number(params.limit) || 10,
      // filters: params?.filters || {},
    }

    const query = useQuery<ApiResponse<T[]>>({
      queryKey: [queryKey, normalizedParams.page, normalizedParams.limit, normalizedParams],
      queryFn: async () => {
        // Clean up params - remove undefined/null values
        const cleanParams = Object.fromEntries(
          Object.entries(normalizedParams).filter(([key, value]) => {
            if (value === undefined || value === null) return false
            if (typeof value === 'string' && value === '') return false
            if (typeof value === 'object' && Object.keys(value).length === 0) return false
            return true
          })
        )
        
        const response = await apiClient.get(url, { params: cleanParams })
        

        return response.data.data 
      },

    })
    return query
  }

  const fetchById = (url: string, queryKey: string, id: string | number) => {
    const query = useQuery<ApiResponse<T>>({
      queryKey: [queryKey, 'single', id],
      queryFn: async () => {
        const response = await apiClient.get(`${url}/${id}`)
        return response.data
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })
    return query
  }

  const createData = (url: string, queryKey: string) =>
    useMutation({
      mutationFn: async (data: Partial<T>) => {
        const response = await apiClient.post(url, data)
        return response.data
      },
      onSuccess: () => {
        // More specific invalidation to prevent unnecessary refetches
        queryClient.invalidateQueries({ 
          queryKey: [queryKey],
          exact: false 
        })
      },
    })

  const updateData = (url: string, queryKey: string) =>
    useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string | number
        data: Partial<T>
      }) => {
        const response = await apiClient.put(`${url}/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ 
          queryKey: [queryKey],
          exact: false 
        })
      },
    })

  const softDeleteData = (url: string, queryKey: string) =>
    useMutation({
      mutationFn: async (id: string | number) => {
        const response = await apiClient.delete(`${url}/${id}/soft`)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ 
          queryKey: [queryKey],
          exact: false 
        })
      },
    })

  const hardDeleteData = (url: string, queryKey: string) =>
    useMutation({
      mutationFn: async (id: string | number) => {
        const response = await apiClient.delete(`${url}/${id}/hard`)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ 
          queryKey: [queryKey],
          exact: false 
        })
      },
    })

  const deleteData = (url: string, queryKey: string) =>
    useMutation({
      mutationFn: async (id: string | number) => {
        const response = await apiClient.delete(`${url}/${id}`)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ 
          queryKey: [queryKey],
          exact: false 
        })
      },
    })

  return {
    fetchData,
    fetchById,
    createData,
    updateData,
    deleteData,
    softDeleteData,
    hardDeleteData,
  }
}