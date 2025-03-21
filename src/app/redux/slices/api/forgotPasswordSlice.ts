import { liveApi } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";

const BASE_URL = `${liveApi}/users`;

// 1️⃣ Request Password Reset (Sends email with reset link)
export const requestPasswordReset = createAsyncThunk(
    "forgotPassword/requestPasswordReset",
    async (username: string, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${BASE_URL}/requestPasswordReset`, { username });
        return response.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>; // Ensure TypeScript knows it's an AxiosError
        return rejectWithValue(axiosError.response?.data.message || "Failed to request password reset");
      }
    }
  );
  
  export const resetPassword = createAsyncThunk(
    "forgotPassword/resetPassword",
    async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${BASE_URL}/resetPassword`, { token, password });
        return response.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>; // Ensure TypeScript knows it's an AxiosError
        return rejectWithValue(axiosError?.message || "Failed to reset password");
      }
    }
  );

  export const changePassword = createAsyncThunk(
    "forgotPassword/changePassword",
    async (
      { userId, oldPassword, newPassword }: { userId: string; oldPassword: string; newPassword: string },
      { rejectWithValue }
    ) => {
      try {
        const response = await axios.post(`${BASE_URL}/changePassword`, { userId, oldPassword, newPassword });
        return response.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message: string }>;
        return rejectWithValue(axiosError.response?.data.message || "Failed to change password");
      }
    }
  );

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    loading: false,
    error: null as string | null,
    successMessage: null as string | null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Request Password Reset
    builder.addCase(requestPasswordReset.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(requestPasswordReset.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload?.message || "Reset link sent successfully!";
    });
    builder.addCase(requestPasswordReset.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Reset Password
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload?.message || "Password reset successfully!";
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //Change Password
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload?.message || "Password changed successfully!";
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearMessages } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
