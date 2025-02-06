import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { stagingApi } from '@/constants';
import Cookies from 'js-cookie';

interface PaymentState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  paymentStatus: any | null; // Holds the statusPayment API response
}

const initialState: PaymentState = {
  status: 'idle',
  error: null,
  paymentStatus: null,
};

const getAuthToken = () => {
  return Cookies.get('token'); // Assuming 'token' is the key in cookies
};

// Async thunk for making the ttPayment API call
export const submitPayment = createAsyncThunk(
  'payment/submitPayment',
  async (paymentData: any, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${stagingApi}/ttPayment`, paymentData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);

// Async thunk for making the statusPayment API call
export const fetchPaymentStatus = createAsyncThunk(
  'payment/fetchPaymentStatus',
  async (requestData: { customerRef: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${stagingApi}/statusPayment`, requestData, {
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
      // submitPayment cases
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
      })
      // fetchPaymentStatus cases
      .addCase(fetchPaymentStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.paymentStatus = null;
      })
      .addCase(fetchPaymentStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paymentStatus = action.payload;
        state.error = null;
      })
      .addCase(fetchPaymentStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default ttpaymentSlice.reducer;
