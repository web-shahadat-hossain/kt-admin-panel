import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiBaseurl, ApiBaseurl2 } from "../constants/ApiEndPoints";
import Cookies from "js-cookie";

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: ApiBaseurl, // Base API URL
  timeout: 60000, // Timeout after 60 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add Authorization or custom headers here if needed
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.params) {
      console.log("Params:", config.params);
    }
    if (config.data) {
      console.log("Data:", config.data);
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Transform response data if needed
    console.log("Response:", response.data);
    return response.data;
  },
  async (error) => {
    // Handle errors globally
    console.error("API Error:", error.response);
    const originalRequest = error.config;
    if (error.response.status === 401) {
      if (originalRequest._retry) {
        Cookies.set("accessToken", "");
        Cookies.set("refreshToken", "");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get("refreshToken");
        const response = await axios.post(`${ApiBaseurl2}/refreshToken`, {
          refreshToken: refreshToken,
        });
        const { accessToken } = response.data;
        Cookies.set("accessToken", accessToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        Cookies.set("accessToken", "");
        Cookies.set("refreshToken", "");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
