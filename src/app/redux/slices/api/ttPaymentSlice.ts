import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { stagingApi } from '@/constants';

interface PaymentState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PaymentState = {
    status: 'idle',
    error: null,
};

// Async thunk for making the API call
export const submitPayment = createAsyncThunk(
    'payment/submitPayment',
    async (paymentData: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${stagingApi}/ttPayment`, paymentData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response ? err.response.data : err.message);
        }
    }
);

const ttpaymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitPayment.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(submitPayment.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(submitPayment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default ttpaymentSlice.reducer;
