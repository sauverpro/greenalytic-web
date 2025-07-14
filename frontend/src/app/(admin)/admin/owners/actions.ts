"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import apiClient from "@/lib/api/axios"


const getAuthHeaders = () => {
  const token = cookies().get("token")?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function createUserAction(data: UserCreateRequest) {
  try {
    await apiClient.post("/users", data, {
      headers: getAuthHeaders(),
    })
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to create user",
    }
  }
}

export async function updateUserAction(id: string, data: UserUpdateRequest) {
  try {
    await apiClient.put(`/users/${id}`, data, {
      headers: getAuthHeaders(),
    })
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update user",
    }
  }
}

export async function softDeleteUserAction(id: string) {
  try {
    await apiClient.delete(`/users/${id}/soft`, {
      headers: getAuthHeaders(),
    })
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to soft delete user",
    }
  }
}

export async function hardDeleteUserAction(id: string) {
  try {
    await apiClient.delete(`/users/${id}/hard`, {
      headers: getAuthHeaders(),
    })
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to hard delete user",
    }
  }
}

export async function restoreUserAction(id: string) {
  try {
    await apiClient.put(`/users/${id}/restore`, {}, {
      headers: getAuthHeaders(),
    })
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to restore user",
    }
  }
}

export async function changeUserRoleAction(id: string, data: ChangeUserRoleRequest) {
  try {
    await apiClient.put(`/users/${id}/role`, data, {
      headers: getAuthHeaders(),
    })
    revalidatePath("/dashboard/users")
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to change user role",
    }
  }
}
