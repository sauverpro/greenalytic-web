import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("API_BASE_URL:", API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`, {
      tokenExists: !!token,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `[Response] ${response.status} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `[Response Error] ${error.response.status} ${error.config.url}`,
        error.response.data
      );
      if (error.response.status === 401) {
        console.log("Unauthorized - clearing cookies and redirecting to login");
        deleteCookie("access_token");
        deleteCookie("user");
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    } else {
      console.error("[Response Error] No response received", error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
