import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Import the base URL
import { stagingApi } from '@/constants';

interface UploadDocState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UploadDocState = {
  status: 'idle',
  error: null,
};

// Async Thunk for uploading approved documents
export const uploadApprovedDoc = createAsyncThunk(
  'uploadApprovedDoc/upload',
  async (
    {
      custRefId,
      transactionRef,
      acctNo,
      isFinal,
    }: {
      custRefId: string;
      transactionRef: string;
      acctNo: number;
      isFinal: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${stagingApi}/uploadApprovedDoc`, // Use the base URL from `stagingApi`
        {
          custRefId,
          transactionRef,
          acctNo,
          isFinal,
        },
        {
          headers: {
            'x-api-key': 'b1bd8e6c-2178-4586-bff3-30d0cea3c38d',
            'X-DBS-ORG_ID': 'INPROD06',
            'X-DBS-PROFILE': 'DEFAULT',
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
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
