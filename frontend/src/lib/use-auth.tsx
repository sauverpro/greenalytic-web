"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { getCookie, setCookie, deleteCookie } from "cookies-next"
import type { User, LoginRequest, SignupRequest, AuthResponse, ApiResponse } from "@/types/index"
import apiClient from "@/lib/api/axios"

interface AuthContextType {
  user: User | null
  login: (credentials: LoginRequest) => Promise<void>
  signup: (data: SignupRequest) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const token = getCookie("access_token")
    const userData = getCookie("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData as string))
      } catch (error) {
        console.error("Error parsing user data:", error)
        deleteCookie("access_token")
        deleteCookie("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>("/users/login", credentials)
      const { user, token } = response.data.data
console.log("token",token)
      setCookie("access_token", token, { maxAge: 60 * 60 * 24 * 7 }) // 7 days
      setCookie("user", JSON.stringify(user), { maxAge: 60 * 60 * 24 * 7 })

      setUser(user)
    } catch (error) {
      throw error
    }
  }

  const signup = async (data: SignupRequest) => {
    try {
      await apiClient.post<ApiResponse<User>>("/auth/register", data)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    deleteCookie("access_token")
    deleteCookie("user")
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
