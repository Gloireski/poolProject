import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { api } from '../../services/api';

export interface AuthState {
  token: string | null;
  user: { fullName: string; email: string } | null;
  loading: boolean;
}

const initialState: AuthState = { token: null, user: null, loading: true };

export const hydrateSession = createAsyncThunk('auth/hydrate', async () => {
  const token = await SecureStore.getItemAsync('token');
  if (!token) return { token: null, user: null };
  const userStr = await SecureStore.getItemAsync('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
});

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token } = res.data;
      await SecureStore.setItemAsync('token', token);
      // fetch full profile to get avatarUrl and latest data
      const me = await api.get('/profile');
      await SecureStore.setItemAsync('user', JSON.stringify(me.data));
      return { token, user: me.data };
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    { fullName, email, password }: { fullName: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/auth/register', { fullName, email, password });
      const { token } = res.data;
      await SecureStore.setItemAsync('token', token);
      const me = await api.get('/profile');
      await SecureStore.setItemAsync('user', JSON.stringify(me.data));
      return { token, user: me.data };
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Register failed';
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('user');
  return { token: null, user: null };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(hydrateSession.pending, (state) => { state.loading = true; })
      .addCase(hydrateSession.fulfilled, (state, action) => { state.token = action.payload.token; state.user = action.payload.user; state.loading = false; })
      .addCase(login.fulfilled, (state, action) => { state.token = action.payload.token; state.user = action.payload.user; state.loading = false; })
      .addCase(login.rejected, (state) => { state.loading = false; })
      .addCase(register.fulfilled, (state, action) => { state.token = action.payload.token; state.user = action.payload.user; state.loading = false; })
      .addCase(register.rejected, (state) => { state.loading = false; })
      .addCase(logout.fulfilled, (state) => { state.token = null; state.user = null; state.loading = false; });
  }
});

export default authSlice.reducer;
