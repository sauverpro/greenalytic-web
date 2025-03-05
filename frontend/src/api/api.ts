import { getAuthToken } from "@/utils/auth";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL:
    process.env.BACKEND_ULR ||
    "https://greenalytic-vehicle-monitoring-1.onrender.com/greenalytic",
});

// Attach token to requests
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default API;
