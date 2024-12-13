import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {stagingApi} from '@/constants';

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
        return rejectWithValue(err.response?.data?.message || err?.message || 'Failed to fetch FX rate');
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
        return rejectWithValue(err.response?.data?.message || err?.message || 'Failed to book FX rate');
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
        });
    },
  });

  export default fxRateSlice.reducer;
