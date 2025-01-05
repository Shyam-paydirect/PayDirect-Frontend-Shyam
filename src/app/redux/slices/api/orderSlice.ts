import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '@/app/redux/store';
import { stagingApi } from '@/constants';

// Define the request type
export interface CreateOrderRequest {
  id?: string; // Optional since it's typically generated on the backend
  orderId: string;
  msgId: string;
  orgId: string;
  timeStamp: string;
  paymentMode: string;
  responseType: string;
  txnStatus: string;
  txnStatusDescription: string;
  sendingPartyName: string | null; // Adjusted to handle null values
  sendingPartyAccountNo: string | null; // Adjusted to handle null values
  receivingPartyName: string | null; // Adjusted to handle null values
  receivingPartyAccountNo: string | null; // Adjusted to handle null values
  createdAt?: string; // Optional if used in responses but not in creation
  updatedAt?: string; // Optional if used in responses but not in creation
}

export interface Order {
  id: string;
  orderId: string;
  msgId: string;
  orgId: string;
  timeStamp: string;
  paymentMode: string;
  responseType: string;
  txnStatus: string;
  txnStatusDescription: string;
  sendingPartyName: string | null; // Adjusted to handle null values
  sendingPartyAccountNo: string | null; // Adjusted to handle null values
  receivingPartyName: string | null; // Adjusted to handle null values
  receivingPartyAccountNo: string | null; // Adjusted to handle null values
  createdAt: string;
  updatedAt: string;
}


// Define the response type
export interface CreateOrderResponse {
  success: boolean;
  message: string;
  [key: string]: any; // Adjust based on actual API response structure
}

// Define the initial state
interface OrderState {
  loading: boolean;
  error: string | null;
  response: CreateOrderResponse | null;
  orders: { data: Order[] } | null; // Explicitly define the structure
}

const initialState: OrderState = {
  loading: false,
  error: null,
  response: null,
  orders: null,
};

// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: CreateOrderRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${stagingApi}/orders/create`, orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data as CreateOrderResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Async thunk for fetching all orders
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${stagingApi}/orders/all`);
      return response.data as { data: Order[] };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Create the slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<CreateOrderResponse>) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action: PayloadAction<{ data: Order[] }>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectOrderState = (state: RootState) => state.orders;

export default orderSlice.reducer;
