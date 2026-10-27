import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from '@/api/tokenStore.ts';

export const clientConfig = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

clientConfig.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

clientConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Token is invalid or expired.');
      tokenStore.clearToken();
    }

    return Promise.reject(error);
  }
);

export const customInstance = <T>(config: any, options?: any): Promise<T> => {
  return clientConfig({
    ...config,
    ...options,
  }).then((response) => response.data);
};