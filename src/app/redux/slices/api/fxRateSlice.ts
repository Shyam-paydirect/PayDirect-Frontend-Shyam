import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { stagingApi } from '@/constants';

interface FxRateState {
    fxRate: number | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null; 
}

const initialState: FxRateState = {
    fxRate: null,
    status: 'idle',
    error: null,
};

export const fetchFxRate = createAsyncThunk(
    'fxRate/fetchFxRate',
    async (bodyData: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${stagingApi}/fxrate/spot-rate`, bodyData);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err?.message || 'Failed to fetch FX rate');
        }
    }
);

export const bookFxRate = createAsyncThunk(
    'fxRate/bookFxRate',
    async (bodyData: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${stagingApi}/fxrate/forward-rate`, bodyData);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err?.message || 'Failed to book FX rate');
        }
    }
);

export const fetchCcyRate = createAsyncThunk(
    'fxRate/fetchCcyRate',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${stagingApi}/ccy/USDINR`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err?.message || 'Failed to fetch currency rate');
        }
    }
);

export const updateCcyRate = createAsyncThunk(
    'fxRate/updateCcyRate',
    async (bodyData: { rate: number }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${stagingApi}/ccy/USDINR`, bodyData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err?.message || 'Failed to update currency rate');
        }
    }
);

const fxRateSlice = createSlice({
    name: 'fxRate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFxRate.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchFxRate.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.fxRate = action.payload;
            })
            .addCase(fetchFxRate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(bookFxRate.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(bookFxRate.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(bookFxRate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchCcyRate.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCcyRate.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.fxRate = action.payload.rate;
            })
            .addCase(fetchCcyRate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(updateCcyRate.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateCcyRate.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(updateCcyRate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default fxRateSlice.reducer;
