import { stagingApi } from '@/constants';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

interface BalanceState {
  balanceData: any;      // Data from the balance enquiry API
  statementData: any;    // Data from the account statement API
  loading: boolean;
  error: string | null;
}

const initialState: BalanceState = {
  balanceData: null,
  statementData: null,
  loading: false,
  error: null,
};

export const fetchBalanceEnquiry = createAsyncThunk(
  'balance/fetchBalanceEnquiry',
  async (
    accountDetails: { accountNo: string; accountCcy: string },
    thunkAPI
  ) => {
    const token = Cookies.get('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${stagingApi}/balanceEnquiry`;
    try {
      const response = await axios.post(url, accountDetails, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAccountStatement = createAsyncThunk(
  'balance/fetchAccountStatement',
  async (
    accountStatementDetails: { accountNo: string; accountCcy: string; bizDate: string },
    thunkAPI
  ) => {
    const token = Cookies.get('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${stagingApi}/accountStatement`;
    try {
      const response = await axios.post(url, accountStatementDetails, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const balanceEnquirySlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Balance enquiry cases
    builder
      .addCase(fetchBalanceEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalanceEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.balanceData = action.payload;
      })
      .addCase(fetchBalanceEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Account statement cases
    builder
      .addCase(fetchAccountStatement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountStatement.fulfilled, (state, action) => {
        state.loading = false;
        state.statementData = action.payload;
      })
      .addCase(fetchAccountStatement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default balanceEnquirySlice.reducer;
