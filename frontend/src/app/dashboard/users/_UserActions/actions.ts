"use server"

import { revalidatePath } from "next/cache"
import apiClient from "@/lib/api/axios"
import type {
  SignupRequest,
  LoginRequest,
  ApiResponse,
  RequestPasswordResetDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
  ChangeRoleDTO,

  UserCreateDTO,
  UserUpdateDTO,
  User,
  GetUserByIdResponse,
  PaginationParams
} from "@/types"
import { Params } from "next/dist/server/request/params"

// -------------------------
// ✅ Public Auth Actions
// -------------------------

export async function signupUser(data: SignupRequest) {
  return await apiClient.post<ApiResponse<null>>("/users/signup", data)
}

export async function loginUser(data: LoginRequest) {
  return await apiClient.post<ApiResponse<{ user: any; token: string }>>("/users/login", data)
}

export async function requestPasswordReset(data: RequestPasswordResetDTO) {
  return await apiClient.post<ApiResponse<null>>("/users/request-password-reset", data)
}

export async function resetPassword(data: ResetPasswordDTO) {
  return await apiClient.post<ApiResponse<null>>("/users/reset-password", data)
}

// -------------------------
// ✅ Authenticated User Actions
// -------------------------

export async function changePassword(data: ChangePasswordDTO) {
  const res = await apiClient.put<ApiResponse<null>>("/users/change-password", data)
  revalidatePath("/dashboard/users") // optional if password change affects display
  return res
}

// -------------------------
// ✅ Admin Management Actions
// -------------------------

export async function createUser(data: UserCreateDTO) {
  const res = await apiClient.post<ApiResponse<GetUserByIdResponse>>("/users", data)
  revalidatePath("/dashboard/users")
  return res.data.data
}

export async function updateUser(id: number, data: UserUpdateDTO) {
  const res = await apiClient.put<ApiResponse<GetUserByIdResponse>>(`/users/${id}`, data)
  revalidatePath("/dashboard/users")
  revalidatePath(`/dashboard/users/${id}`)
  return res.data.data
}

export async function listUsers(params?:PaginationParams) {
  const res = await apiClient.get<ApiResponse<User>>("/users", { params })
  return res.data.data
}

export async function getUserById(id: number) {
  const res = await apiClient.get<ApiResponse<GetUserByIdResponse>>(`/users/${id}`)
  return res.data.data
}

export async function softDeleteUser(id: string) {
  const res = await apiClient.delete<ApiResponse<null>>(`/users/${id}/soft`)
  revalidatePath("/dashboard/users")
  return res
}

export async function hardDeleteUser(id: string) {
  const res = await apiClient.delete<ApiResponse<null>>(`/users/${id}/hard`)
  revalidatePath("/dashboard/User")
  return res
}

export async function restoreUser(id: string) {
  const res = await apiClient.put<ApiResponse<null>>(`/users/${id}/restore`)
  revalidatePath("/dashboard/users")
  return res
}

export async function changeUserRole(id: string, data: ChangeRoleDTO) {
  const res = await apiClient.put<ApiResponse<null>>(`/users/${id}/role`, data)
  revalidatePath("/dashboard/users")
  revalidatePath(`/dashboard/users/${id}`)
  return res
}
