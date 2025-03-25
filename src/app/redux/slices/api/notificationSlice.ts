import { stagingApi } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface TransactionUpdate {
  transactionId: string;
  txnSettlementAmt: number;
  status: string;
  description: string;
  txnSettlementDt: string | null;
  responseType: string;
  createdAt: string;
}

export interface OrderNotification {
  orderId: string;
  createdAt: string;
  sendingPartyAccountNo: string;
  receivingPartyAccountNo: string;
  transactionUpdates: TransactionUpdate[];
}

interface UserNotificationResponse {
  errorCode: number;
  message: string;
  data: OrderNotification[];
}

interface UserNotificationState {
  notifications: OrderNotification[];
  loading: boolean;
  error: string | null;
}

const initialState: UserNotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchUserNotifications = createAsyncThunk<
  OrderNotification[],
  number,
  { rejectValue: string }
>(
  "userNotifications/fetchUserNotifications",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get<UserNotificationResponse>(
        `${stagingApi}/userNotification?userId=${userId}`,
        {}
      );
      if (response.data.errorCode !== 0) {
        return rejectWithValue(response.data.message || "Error fetching notifications");
      }
      return response.data.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message || "Failed to fetch notifications"
      );
    }
  }
);

const userNotificationSlice = createSlice({
  name: "userNotification",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserNotifications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
    });
    builder.addCase(fetchUserNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch notifications";
    });
  },
});

export const { clearNotifications } = userNotificationSlice.actions;
export default userNotificationSlice.reducer;
