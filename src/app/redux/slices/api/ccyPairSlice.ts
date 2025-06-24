import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getStagingApi } from '@/constants';

// Define the type for the client currency resource
export interface ClientCurrency {
  client_id: string;
  sending_currencies: string[];
  receiving_currencies: string[];
}

// Define the slice state interface
interface ClientCurrencyState {
  data?: ClientCurrency;
  loading: boolean;
  error?: string;
  errorCode: number;
  message: string;
}

const initialState: ClientCurrencyState = {
  data: undefined,
  loading: false,
  errorCode: 0,
  message: ""
};

// GET: Retrieve client currency by client id using axios
export const getClientCurrency = createAsyncThunk<
  ClientCurrency,
  string,
  { rejectValue: string }
>(
  'clientCurrency/getClientCurrency',
  async (clientId, { rejectWithValue }) => {
    try {
      const response = await axios.get<ClientCurrencyState>(`${getStagingApi()}/clientCurrency/${clientId}`);
      if (response.data.errorCode !== 0) {
        return rejectWithValue(response.data.message || "Error fetching client currency");
      }
      // Extract the actual client currency data from the API response
      return response.data.data as ClientCurrency;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


// PUT: Update client currency by client id using axios
export const updateClientCurrency = createAsyncThunk<
  ClientCurrency,
  { clientId: string; data: Omit<ClientCurrency, 'client_id'> },
  { rejectValue: string }
>(
  'clientCurrency/updateClientCurrency',
  async ({ clientId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put<ClientCurrency>(`${getStagingApi()}/clientCurrency/${clientId}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// POST: Add a new client currency record using axios
export const addClientCurrency = createAsyncThunk<
  ClientCurrency,
  ClientCurrency,
  { rejectValue: string }
>(
  'clientCurrency/addClientCurrency',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await axios.post<ClientCurrency>(`${getStagingApi()}/clientCurrency`, clientData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create the slice
const clientCurrencySlice = createSlice({
  name: 'clientCurrency',
  initialState,
  reducers: {
    // Add any synchronous reducers here if needed.
  },
  extraReducers: (builder) => {
    // GET
    builder.addCase(getClientCurrency.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getClientCurrency.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getClientCurrency.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch client currency';
    });
    // PUT
    builder.addCase(updateClientCurrency.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(updateClientCurrency.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(updateClientCurrency.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update client currency';
    });
    // POST
    builder.addCase(addClientCurrency.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(addClientCurrency.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(addClientCurrency.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to add client currency';
    });
  },
});

// Export the reducer to include it in your Redux store
export default clientCurrencySlice.reducer;
