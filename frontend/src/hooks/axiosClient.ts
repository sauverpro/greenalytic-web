import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

const useAxiosClient = (): AxiosInstance => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_ULR;


  const client = axios.create({
    baseURL,
    withCredentials: false,
  });

  client.interceptors.request.use((config: any) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    config.headers = config.headers || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      try {
        const { response } = error;
        if (response?.status === 401) {
          localStorage.removeItem("AUTH_TOKEN");
        }
      } catch (e) {
        console.error(e);
      }
      throw error;
    }
  );

  return client;
};

export default useAxiosClient;
