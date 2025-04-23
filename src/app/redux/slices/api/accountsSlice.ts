import { stagingApi } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API endpoints
const CREATE_ACCOUNT_API = `${stagingApi}/account/create`;
const FETCH_ACCOUNTS_API = `${stagingApi}/account/all`;
const SEARCH_ACCOUNTS_API = `${stagingApi}/account/search`;
const COUNTRY_CODE_API = `${stagingApi}/account/countryCodeList`;

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
  countryCode?: string;
  createdAt?: string;
  updatedAt?: string;
  selfAccount?: number;
}

interface AccountState {
  accounts: Account[];
  countryCodes: [];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  countryCodes: [],
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
      const response = await axios.get(
        `${SEARCH_ACCOUNTS_API}?name=${name}&userId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data || []; // Extract `data` array from response
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const countryCodeList = createAsyncThunk(
  "accounts/countryCodeList",
  async ( __, {rejectWithValue}) => {
    try {
      const response = await axios.get(
        `${COUNTRY_CODE_API}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      return response.data.data || []
    }
    catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch country codes'
      );
    }
  }
)

// Create the accounts slice
const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Account Cases
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload && typeof action.payload === "object"
            ? (action.payload as any).message
            : (action.payload as string);
      })
      // Fetch Accounts Cases
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
        state.error =
          action.payload && typeof action.payload === "object"
            ? (action.payload as any).message
            : (action.payload as string);
      })
      // Search Accounts Cases
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
        state.error =
          action.payload && typeof action.payload === "object"
            ? (action.payload as any).message
            : (action.payload as string);
      })
      // Country Code Cases
      .addCase(countryCodeList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(countryCodeList.fulfilled, (state, action) => {
        state.loading = false;
        state.countryCodes = action.payload;
      })
      .addCase(countryCodeList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload && typeof action.payload === "object"
            ? (action.payload as any).message
            : (action.payload as string);
      })
  },
});

export default accountsSlice.reducer;
