import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

function resolveHost(): string {
  // Try to infer LAN host from Metro URL
  const host = (Constants as any)?.expoConfig?.hostUri || (Constants as any)?.manifest2?.extra?.expoClient?.hostUri;
  if (host) return host.split(':')[0];
  // Fallback: put your LAN IP here if needed
  return '192.168.1.31';
}

const host = resolveHost();
const BASE_URL = Platform.select({
  ios: `http://${host}:3001/api`,
  android: `http://${host}:3001/api`,
  default: `http://${host}:3001/api`,
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
