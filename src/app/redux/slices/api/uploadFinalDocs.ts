import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Import the base URL
import { getStagingApi } from '@/constants';

interface UploadDocState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UploadDocState = {
  status: 'idle',
  error: null,
};

const getAuthToken = () => {
  return Cookies.get('token'); // Assuming 'token' is the key in cookies
};

// Async Thunk for uploading approved documents
export const uploadApprovedDoc = createAsyncThunk(
  'uploadApprovedDoc/upload',
  async (
    {
      custRefId,
      isFinal,
    }: {
      custRefId: string;
      isFinal: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${getStagingApi()}/uploadApprovedDoc`, // Use the base URL from getStagingApi()
        {
          custRefId,
          isFinal,
        },
        {
          headers: {
            'x-api-key': 'b1bd8e6c-2178-4586-bff3-30d0cea3c38d',
            'X-DBS-ORG_ID': 'INPROD06',
            'X-DBS-PROFILE': 'DEFAULT',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.data.message : error.data.message);
    }
  }
);

const uploadApprovedDocSlice = createSlice({
  name: 'uploadApprovedDoc',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadApprovedDoc.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadApprovedDoc.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(uploadApprovedDoc.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetState } = uploadApprovedDocSlice.actions;

export default uploadApprovedDocSlice.reducer;
