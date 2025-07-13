"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { type User, type LoginRequest, type SignupRequest, type AuthResponse, type ApiResponse, UserStatus, UserRole } from "@/types/index";
import apiClient from "@/lib/api/axios";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (roles: string | string[]) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dummy admin user and token for quick mock
  const dummyUser: User = {
    id: 1006,
    username: "imanariyo baptiste",
    email: "imanariyobaptiste@gmail.com",
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    image:
      "https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
    phoneNumber: "+250788123456",
    companyName: "Greenalytic Inc.",
    location: "Kigali, Rwanda",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const dummyToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwNiwiZW1haWwiOiJpbWFuYXJpeW9iYXB0aXN0ZUBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJ1c2VybmFtZSI6ImltYW5hcml5byBiYXB0aXN0ZSIsImlhdCI6MTc1MjQxMzcwMywiZXhwIjoxNzUyNDQ5NzAzfQ.XAI8GEyPTkzZHu5_dkermYQrbGqnFvJ75n0V4wEbfaM";

  useEffect(() => {
    const token = getCookie("access_token");
    const userData = getCookie("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData as string));
      } catch (error) {
        console.error("Error parsing user data:", error);
        deleteCookie("access_token");
        deleteCookie("user");
      }
    } else {
      // Set dummy user and token if none found (for dev/testing)
      setCookie("access_token", dummyToken, { maxAge: 60 * 60 * 24 * 7 });
      setCookie("user", JSON.stringify(dummyUser), { maxAge: 60 * 60 * 24 * 7 });
      setUser(dummyUser);
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>("/users/login", credentials);
      const { user, token } = response.data.data;
      setCookie("access_token", token, { maxAge: 60 * 60 * 24 * 7 }); // 7 days
      setCookie("user", JSON.stringify(user), { maxAge: 60 * 60 * 24 * 7 });
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      await apiClient.post<ApiResponse<User>>("/auth/register", data);
    } catch (error) {
      throw error;
    }
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const logout = () => {
    deleteCookie("access_token");
    deleteCookie("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        hasRole,
        isLoading,
        isAuthenticated: !!user && !!getCookie("access_token"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
