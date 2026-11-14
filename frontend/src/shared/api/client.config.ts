import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from '@/shared/api/tokenStore.ts';

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;

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

export const customInstance = async <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  return clientConfig({
    ...config,
    ...options,
  }).then((response) => response.data);
};
