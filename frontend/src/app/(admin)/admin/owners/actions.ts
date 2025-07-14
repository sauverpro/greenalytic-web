"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import apiClient from "@/lib/api/axios"



// export async function createUserAction(data: UserCreateRequest) {
//   try {
//     await apiClient.post("/users", data)
//     revalidatePath("/dashboard/users")
//     return { success: true }
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error?.response?.data?.message || "Failed to create user",
//     }
//   }
// }

// export async function updateUserAction(id: string, data: UserUpdateRequest) {
//   try {
//     await apiClient.put(`/users/${id}`, data)
//     revalidatePath("/dashboard/users")
//     return { success: true }
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error?.response?.data?.message || "Failed to update user",
//     }
//   }
// }

// export async function softDeleteUserAction(id: string) {
//   try {
//     await apiClient.delete(`/users/${id}/soft`)
//     revalidatePath("/dashboard/users")
//     return { success: true }
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error?.response?.data?.message || "Failed to soft delete user",
//     }
//   }
// }

// export async function hardDeleteUserAction(id: string) {
//   try {
//     await apiClient.delete(`/users/${id}/hard`)
//     revalidatePath("/dashboard/users")
//     return { success: true }
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error?.response?.data?.message || "Failed to hard delete user",
//     }
//   }
// }

// export async function restoreUserAction(id: string) {
//   try {
//     await apiClient.put(`/users/${id}/restore`)
//     revalidatePath("/dashboard/users")
//     return { success: true }
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error?.response?.data?.message || "Failed to restore user",
//     }
//   }
// }

// export async function changeUserRoleAction(id: string, data: ChangeUserRoleRequest) {
//   try {
//     await apiClient.put(`/users/${id}/role`, data)
//     revalidatePath("/dashboard/users")
//     return { success: true }
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error?.response?.data?.message || "Failed to change user role",
//     }
//   }
// }
