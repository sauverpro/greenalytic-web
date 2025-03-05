import { getAuthToken } from "@/utils/auth";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_ULR
});

// Attach token to requests
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // const token = getAuthToken();
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDMwLCJlbWFpbCI6ImltYW5hcml5b2JhcHRpc3RlQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiSm9obkRvZSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0MTE3NTM1OSwiZXhwIjoxNzQxMjExMzU5fQ.NAU3lTtozjWPRccWjyqWeJIrTOe6nNebWDSUU6w50xE";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Log the request headers before sending
    console.log("🚀 Axios Request Headers:", config.headers);

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default API;
