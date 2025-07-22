import apiClient from "@/lib/api/axios";
import { setCookie } from "cookies-next";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {

  email: string;
  phoneNumber: string;
  nationalId?: string;
  username: string;
  password: string;
  role: string;
  companyName?: string;
   companyRegistrationNumber?: string;
  businessSector?: string;
  fleetSize?: number;
  notificationPreference: "email" | "sms" | "whatsapp";
  language: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
    fullName: string;
  };
}

export interface GoogleAuthResponse {
  success: boolean;
  message: string;
  redirectUrl?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/users/login", credentials);

      if (response.data.success && response.data.token) {
        setCookie("access_token", response.data.token, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        if (response.data.user) {
          setCookie("user", JSON.stringify(response.data.user), {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        }
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    }
  }

  async signup(signupData: SignupData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/users/signup", signupData);

      if (response.data.success && response.data.token) {
        setCookie("access_token", response.data.token, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        if (response.data.user) {
          setCookie("user", JSON.stringify(response.data.user), {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        }
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Signup failed. Please try again."
      );
    }
  }

  async initiateGoogleLogin(): Promise<void> {
    const googleAuthUrl = `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/auth/google`;
    window.location.href = googleAuthUrl;
  }

  async handleGoogleCallback(token: string): Promise<AuthResponse> {
    try {
      // Only store token, skip fetching user data
      setCookie("access_token", token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return {
        success: true,
        message: "Google login successful",
        token,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Google login failed. Please try again."
      );
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/users/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setCookie("access_token", "", { maxAge: 0 });
      setCookie("user", "", { maxAge: 0 });

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  async requestPasswordReset(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post("/users/request-password-reset", {
        email,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Password reset request failed. Please try again."
      );
    }
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post("/users/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Password reset failed. Please try again."
      );
    }
  }
}

export const authService = new AuthService();
export default authService;
