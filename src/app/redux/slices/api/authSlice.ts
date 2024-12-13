import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';
import {liveApi} from '@/constants';

interface AuthState {
  token: string | null;
  merchantDetails: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  message: string | null;
}

const initialState: AuthState = {
  token: null,
  merchantDetails: null,
  status: 'idle',
  message: null,
};

// Decode JWT
// const decodeToken = (token: string) => jwtDecode(token);

export const sendEmailOtp = createAsyncThunk(
  'auth/sendEmailOtp',
  async (
    { email }: { email: string; },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${liveApi}/users/sendEmailOtp`, { email });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'OTP failed to be sent.');
    }
  }
);

export const verifyEmailOtp = createAsyncThunk(
  'auth/verifyEmailOtp',
  async (
    { otp }: { otp: string; },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${liveApi}/users/verifyEmailOtp`, { otp });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed.');
    }
  }
);

// Signup action
export const signup = createAsyncThunk(
  'auth/signup',
  async (
    { email, username, password }: { email: string; username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${liveApi}/users/signup`, {
        email,
        username,
        password,
        role: 'admin',
        status: 'active',
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Signup failed.');
    }
  }
);

// Login action
export const login = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${liveApi}/users/login`, { username, password });
      const token = response.data.token;

      Cookies.set('token', token, {
        expires: 4 / 24, // 4 hours
        secure: true, // HTTPS only
        sameSite: 'Strict', // Prevent CSRF
      });
      // Decode and return token
      return token;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed.');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.merchantDetails = null;
      Cookies.remove('token'); // Clear token from storage
      state.status = 'idle';
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message || 'Signup successful!';
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      })
      .addCase(sendEmailOtp.pending, (state) => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(sendEmailOtp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message || 'Signup successful!';
      })
      .addCase(sendEmailOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      });
  },
});

export const { logout, clearMessage } = authSlice.actions;
export default authSlice.reducer;
