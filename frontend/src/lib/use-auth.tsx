"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  getCookie,
  setCookie,
  deleteCookie,
} from "cookies-next";
import apiClient from "@/lib/api/axios";
import {
  type User,
  type LoginRequest,
  type SignupRequest,
  type AuthResponse,
  type ApiResponse,

} from "@/types";
import { UserRole, UserStatus } from "@/types/EnumTypes";
import axios from "axios";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<ApiResponse<AuthResponse>>;
  signup: (data: SignupRequest) => Promise<ApiResponse<AuthResponse>>;
  logout: () => void;
  handleGoogleCallback: (token: string) => Promise<void>;
  initiateGoogleLogin: () => void;
  isLoading: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isAuthenticated: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);



  // Load user from cookies
  useEffect(() => {
    const token = getCookie("access_token");
    const userData = getCookie("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData as string));
      } catch (error) {
        deleteCookie("access_token");
        deleteCookie("user");
        console.error("Invalid user cookie", error);
      }
    } else {


    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await axios.post<ApiResponse<AuthResponse>>(
        "https://greenalytic-vehicle-monitoring-1.onrender.com/api/users/login",
        credentials
      );
      const { token, user } = response.data.data;
      setCookie("access_token", token, { maxAge: 60 * 60 * 24 * 7 });
      setCookie("user", JSON.stringify(user), { maxAge: 60 * 60 * 24 * 7 });
      setUser(user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  const signup = async (data: SignupRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/users/signup",
        data
      );
      const { token, user } = response.data.data;
      setCookie("access_token", token, { maxAge: 60 * 60 * 24 * 7 });
      setCookie("user", JSON.stringify(user), { maxAge: 60 * 60 * 24 * 7 });
      setUser(user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  const logout = () => {
    deleteCookie("access_token");
    deleteCookie("user");
    setUser(null);
    window.location.href = "/auth/login";
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const arr = Array.isArray(roles) ? roles : [roles];
    return arr.includes(user.role);
  };

  const initiateGoogleLogin = () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    window.location.href = `${base}/auth/google`;
  };

  const handleGoogleCallback = async (token: string) => {
    try {
      setCookie("access_token", token, {
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Optionally fetch user from API after Google login
      const userResponse = await apiClient.get<ApiResponse<User>>("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userResponse.data.data);
      setCookie("user", JSON.stringify(userResponse.data.data), {
        maxAge: 60 * 60 * 24 * 7,
      });
    } catch (error) {
      throw new Error("Google login failed");
    }
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
        initiateGoogleLogin,
        handleGoogleCallback,
        isAuthenticated: !!user && !!getCookie("access_token"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
