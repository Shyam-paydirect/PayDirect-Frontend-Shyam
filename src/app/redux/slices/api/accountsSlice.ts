import { stagingApi } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API endpoints
const CREATE_ACCOUNT_API = `${stagingApi}/account/create`;
const FETCH_ACCOUNTS_API = `${stagingApi}/account/all`;
const SEARCH_ACCOUNTS_API = `${stagingApi}/account/search`;

// Define the initial state
interface Account {
  userId: string;
  name: string;
  accountNo: string;
  swiftBic: string;
  IFSC: string;
  UPI_ID: string;
  bankName: string;
  bankAddress: string;
  beneficiaryAddresses: { address: string }[];
  branchCode: string;
  micrCode: string;
  createdAt?: string;
  updatedAt?: string;
  selfAccount?:  number;
}

interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
};

// Define the async thunk for creating an account
export const createAccount = createAsyncThunk(
  "accounts/createAccount",
  async (accountData: Account, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(CREATE_ACCOUNT_API, accountData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Fetch updated account list after creating the account
      dispatch(fetchAccounts(accountData.userId));
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Define the async thunk for fetching all accounts
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${FETCH_ACCOUNTS_API}?userId=${userId}`);
      return response.data.data || []; // Extract `data` array from response
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Define the async thunk for searching accounts by name
export const searchAccounts = createAsyncThunk(
  "accounts/searchAccounts",
  async ({ name, userId }: { name: string; userId: string }, { rejectWithValue }) => {
    try {
      console.log("nnnn", name, userId)
      const response = await axios.get(`${SEARCH_ACCOUNTS_API}?name=${name}&&userId=${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data || []; // Extract `data` array from response
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Create the accounts slice
const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload; // Update accounts with fetched data
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload; // Update accounts with search results
      })
      .addCase(searchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default accountsSlice.reducer;
