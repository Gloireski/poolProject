import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = Platform.select({
  ios: 'http://127.0.0.1:3001/api',
  android: 'http://10.0.2.2:3001/api',
  default: 'http://127.0.0.1:3001/api',
});

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const method = err?.config?.method?.toUpperCase?.() || 'GET';
    const url = err?.config?.url || '';
    const status = err?.response?.status;
    const message = err?.response?.data?.message || err?.message;
    console.log(`[api] ${method} ${url} → ${status || 'ERR'} ${message}`);
    return Promise.reject(err);
  }
);
