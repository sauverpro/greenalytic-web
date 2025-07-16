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

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  handleGoogleCallback: (token: string) => Promise<void>;
  initiateGoogleLogin: () => void;
  isLoading: boolean;
  hasRole: (roles: string | string[]) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dummy for dev testing
  const dummyUser: User = {
    id: 1006,
    username: "imanariyo baptiste",
    email: "imanariyobaptiste@gmail.com",
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    phoneNumber: "+250788123456",
    companyName: "Greenalytic Inc.",
    location: "Kigali, Rwanda",
    image:
      "https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const dummyToken = "DUMMY_JWT_TOKEN";

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
      // Dev fallback (optional)
      setCookie("access_token", dummyToken, { maxAge: 60 * 60 * 24 * 7 });
      setCookie("user", JSON.stringify(dummyUser), { maxAge: 60 * 60 * 24 * 7 });
      setUser(dummyUser);
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/users/login",
        credentials
      );
      const { token, user } = response.data.data;
      setCookie("access_token", token, { maxAge: 60 * 60 * 24 * 7 });
      setCookie("user", JSON.stringify(user), { maxAge: 60 * 60 * 24 * 7 });
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/users/signup",
        data
      );
      const { token, user } = response.data.data;
      setCookie("access_token", token, { maxAge: 60 * 60 * 24 * 7 });
      setCookie("user", JSON.stringify(user), { maxAge: 60 * 60 * 24 * 7 });
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    deleteCookie("access_token");
    deleteCookie("user");
    setUser(null);
    window.location.href = "/login";
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const arr = Array.isArray(roles) ? roles : [roles];
    return arr.includes(user.role);
  };

  const initiateGoogleLogin = () => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
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
