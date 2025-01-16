import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { docsApi } from '@/constants';

// Async thunk to fetch documents for an orderID
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (orderID: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${docsApi}/documents/${orderID}/all`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch file data from s3_path
export const fetchFileData = createAsyncThunk(
  'documents/fetchFileData',
  async (s3Path: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${docsApi}/documents/view?path=${s3Path}`);
      return response.data ;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface DocumentState {
  documents: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch documents
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.allDocs;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch file data
      .addCase(fetchFileData.fulfilled, (state, action) => {
        // File data can be handled separately or integrated as needed
      })
      .addCase(fetchFileData.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default documentSlice.reducer;
