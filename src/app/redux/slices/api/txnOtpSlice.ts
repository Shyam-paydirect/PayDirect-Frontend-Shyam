import { liveApi, stagingApi } from "@/constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Types for API responses and inputs
interface SendOtpPayload {
    transactionId: string;
    userId: string;
    phoneNumber?: string;
    email: string;
}

interface VerifyOtpPayload {
    transactionId: string;
    otp: string;
}

interface UserDetailsResponse {
    user_data: {
        id: number;
        username: string;
        email: string;
        merchant_id: string;
        role: string;
        status: string;
        photo: string | null;
        createdAt: string;
    }
}

// Async Thunks for API calls
export const sendOtp = createAsyncThunk(
    "otp/sendOtp",
    async ({ transactionId, userId, phoneNumber, email }: SendOtpPayload, thunkAPI) => {
        try {
            const response = await axios.post(`${stagingApi}/transaction/sendOtp`, {
                transactionId,
                userId,
                phoneNumber,
                email,
            });
            return response.data;
        } catch (error: any) {
            console.log("WHAT the FUCKKKK", error)
            return thunkAPI.rejectWithValue(error.response ? error.response.data.message : error.data.message);
        }
    }
);

export const verifyOtp = createAsyncThunk(
    "otp/verifyOtp",
    async ({ transactionId, otp }: VerifyOtpPayload, thunkAPI) => {
        try {
            const response = await axios.post(`${stagingApi}/transaction/verifyOtp`, {
                transactionId,
                otp,
            });
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data.message : error.data.message);
        }
    }
);

export const fetchUserDetails = createAsyncThunk(
    "user/fetchUserDetails",
    async (userId: number, thunkAPI) => {
        try {
            const response = await axios.get<UserDetailsResponse>(
                `${liveApi}/users/searchUser?userId=${userId}`
            );
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data.message : error.data.message);
        }
    }
);

// Redux Slice
interface OtpState {
    isLoading: boolean;
    error: string | null;
}

const initialState: OtpState = {
    isLoading: false,
    error: null,
};

const otpSlice = createSlice({
    name: "otp",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendOtp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(verifyOtp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default otpSlice.reducer;
