import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { liveApi, updateStagingApi } from '@/constants';

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

// Send Email OTP
export const sendEmailOtp = createAsyncThunk(
  'auth/sendEmailOtp',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${liveApi}/users/sendEmailOtp`, { email });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'OTP failed to be sent.');
    }
  }
);

// Verify Email OTP
export const verifyEmailOtp = createAsyncThunk(
  'auth/verifyEmailOtp',
  async ({ otp }: { otp: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${liveApi}/users/verifyEmailOtp`, { otp });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed.');
    }
  }
);

// Verify Login OTP (updated to handle token and login verification)
export const verifyLoginOtp = createAsyncThunk(
  'auth/verifyLoginOtp',
  async ({ username, otp }: { username: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${liveApi}/users/verifyLoginOtp`, { username, otp });
      const { token, message, role, merchant_id, clientId } = response.data;

      // Store token in Cookies and localStorage
      Cookies.set('token', token, {
        expires: 4 / 24, // 4 hours
        secure: true, // HTTPS only
        sameSite: 'Strict', // Prevent CSRF
      });
      Cookies.set('clientId', clientId);
      // Update stagingApi based on the new clientId
      updateStagingApi();
      Cookies.set('role', role);
      Cookies.set('merchant_id', merchant_id, {
        expires: 4 / 24, // 4 hours
        secure: true, // HTTPS only
        sameSite: 'Strict', // Prevent CSRF
      });
      localStorage.setItem('token', token);

      return message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login OTP verification failed.');
    }
  }
);

// Signup action
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, username, password }: { email: string; username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${liveApi}/users/signup`, { email, username, password, role: 'admin', status: 'active' });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Signup failed.');
    }
  }
);

// Login action (only returns the response data, no token handling here)
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${liveApi}/users/login`, { username, password });
      return response.data;  // No token handling here anymore
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
      Cookies.remove('role')
      Cookies.remove('clientId')
      Cookies.remove('merchant_id')
      localStorage.removeItem('token'); // Also clear token from localStorage
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
        // No token handling here anymore
        state.message = action.payload.message || 'Login successful!';
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
        state.message = action.payload.message || 'OTP sent successfully!';
      })
      .addCase(sendEmailOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      })
      .addCase(verifyLoginOtp.pending, (state) => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;  // Now the token is set here
        state.message = 'Login OTP verified successfully!';
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload as string;
      });
  },
});

export const { logout, clearMessage } = authSlice.actions;
export default authSlice.reducer;
