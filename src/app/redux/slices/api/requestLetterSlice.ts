import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getStagingApi } from '@/constants';

export interface RequestLetterFormData {
  // Original form fields
  date: string;
  hsn_code: string;
  shipment_from: string;
  shipment_to: string;
  country_of_origin: string;
  tentative_shipment_date: string;
  amount: string;
  currency: string;
  remitter_address: string;
  beneficiary_name: string;
  beneficiary_address: string;
  beneficiary_account: string;
  bank_name: string;
  bank_address: string;
  swift_code: string;
  transaction_details: string;
  foreign_bank_charges: string;
  debit_inr_ac: string;
  signatory_name: string;

  // Additional API fields
  branch_name: string;
  client_name: string;
  address: string;
  amount_in_words: string;
  goods_description: string;
  country_of_shipment: string;
  port_of_discharge: string;
  invoice_number: string;
  invoice_date: string;
  invoice_value: string;
  igst_applicable: string;
  tax_note: string;
  declaration_place: string;
  declaration_date: string;
  declaration_signed_by: string;
  deal_reference: string;
  fx_rate_booked: boolean;
  value_date: string;
  debit_eefc_ac: string;
  debit_our_ac: string;
  reason_not_taxable: string;
  documents_enclosed: string[];
  signatory_stamp: string;
}

interface RequestLetterState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pdfBlob: Blob | null;
}

const initialState: RequestLetterState = {
  status: 'idle',
  error: null,
  pdfBlob: null,
};

export const generateLetter = createAsyncThunk<Blob, RequestLetterFormData>(
  'requestLetter/generate',
  async (formData: RequestLetterFormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${getStagingApi()}/requestLetter/generate-pdf`, formData, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
        }
      });
      
      // Check if the response is actually a PDF
      if (response.data.type !== 'application/pdf') {
        // If it's not a PDF, it might be an error response
        const text = await new Response(response.data).text();
        const error = JSON.parse(text);
        return rejectWithValue(error.message || 'Failed to generate PDF');
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data instanceof Blob) {
        // Try to parse error message from blob
        const text = await new Response(error.response.data).text();
        try {
          const errorData = JSON.parse(text);
          return rejectWithValue(errorData.message || 'Failed to generate PDF');
        } catch {
          return rejectWithValue('Failed to generate PDF');
        }
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const requestLetterSlice = createSlice({
  name: 'requestLetter',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateLetter.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.pdfBlob = null;
      })
      .addCase(generateLetter.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.pdfBlob = action.payload;
      })
      .addCase(generateLetter.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.pdfBlob = null;
      });
  },
});

export const { resetState } = requestLetterSlice.actions;

export default requestLetterSlice.reducer; 