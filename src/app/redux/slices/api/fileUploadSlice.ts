import { testingApi } from '@/constants';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface FileUploadState {
  files: File[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FileUploadState = {
  files: [],
  status: 'idle',
  error: null,
};

// Async Thunk for uploading files
export const uploadFiles = createAsyncThunk(
  'fileUpload/uploadFiles',
  async ({ files, custRefId, customerId }: { files: File[]; custRefId: string, customerId: string }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('custRefId', custRefId);
      formData.append('customerId', customerId);
      files.forEach((file) => formData.append('files', file));

      const response = await axios.post(`${testingApi}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const fileUploadSlice = createSlice({
  name: 'fileUpload',
  initialState,
  reducers: {
    addFile: (state, action) => {
      state.files.push(action.payload);
    },
    removeFile: (state, action) => {
      state.files = state.files.filter((file) => file.name !== action.payload.name);
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { addFile, removeFile, resetState } = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
