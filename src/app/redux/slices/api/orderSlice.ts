import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '@/app/redux/store';
import { stagingApi } from '@/constants';

// Define the request type
export interface CreateOrderRequest {
  userId: number;
  txnAmount: string;
  statusPayment: string;
  id?: string;
  orderId: string;
  msgId: string;
  orgId: string;
  timeStamp: string;
  paymentMode: string;
  responseType: string;
  txnStatus: string;
  txnStatusDescription: string;
  sendingPartyName: string | null;
  sendingPartyAccountNo: string | null;
  receivingPartyName: string | null;
  receivingPartyAccountNo: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  userId: number;
  txnAmount: string;
  statusPayment: string;
  orderId: string;
  msgId: string;
  orgId: string;
  timeStamp: string;
  paymentMode: string;
  responseType: string;
  txnStatus: string;
  txnStatusDescription: string;
  sendingPartyName: string | null;
  sendingPartyAccountNo: string | null;
  receivingPartyName: string | null;
  receivingPartyAccountNo: string | null;
  createdAt: string;
  updatedAt: string;
  bookedFxRate? : string;
}

// Define the response type
export interface CreateOrderResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

// Define the initial state
interface OrderState {
  loading: boolean;
  error: string | null;
  response: CreateOrderResponse | null;
  orders: { data: Order[] } | null;
  selectedOrderId: string | null; // Added for storing the selected order ID
}

const initialState: OrderState = {
  loading: false,
  error: null,
  response: null,
  orders: null,
  selectedOrderId: null, // Initialize with null
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
  async (userID: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${stagingApi}/orders/all?userId=${userID}`);
      return response.data as { data: Order[] };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Async thunk for updating order payment status
export const updateOrderPaymentStatus = createAsyncThunk(
  'orders/updateOrderPaymentStatus',
  async (
    { orderId, statusPayment }: { orderId: string; statusPayment: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${stagingApi}/updateStatusPayment`,
        {
          orderId,
          statusPayment,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data as { success: boolean; message: string };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Create the slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSelectedOrderId: (state, action: PayloadAction<string>) => {
      state.selectedOrderId = action.payload;
    },
  },
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
      })
      .addCase(updateOrderPaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderPaymentStatus.fulfilled, (state, action: PayloadAction<{ success: boolean; message: string }>) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(updateOrderPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedOrderId } = orderSlice.actions;

export const selectOrderState = (state: RootState) => state.orders;
export const selectSelectedOrderId = (state: RootState) => state.orders.selectedOrderId; // Selector for selectedOrderId

export default orderSlice.reducer;
