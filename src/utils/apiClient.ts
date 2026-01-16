import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically include auth token in requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle responses and errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
)

export default apiClient;

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  status: number;
}

// Wrapper functions for type safety
export const api = {
  get: <T>(url: string, params?: Parameters<typeof apiClient.get>[1]): Promise<ApiResponse<T>> =>
    apiClient.get<T>(url, params),

  post: <T>(url: string, data?: unknown, config?: Parameters<typeof apiClient.post>[2]): Promise<ApiResponse<T>> =>
    apiClient.post<T>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: Parameters<typeof apiClient.put>[2]): Promise<ApiResponse<T>> =>
    apiClient.put<T>(url, data, config),

  delete: <T>(url: string, config?: Parameters<typeof apiClient.delete>[1]): Promise<ApiResponse<T>> =>
    apiClient.delete<T>(url, config),
}
