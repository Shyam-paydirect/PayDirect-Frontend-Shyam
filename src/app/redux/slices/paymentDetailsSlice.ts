import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentDetailsState {
  remittanceAmount: string;
  currency: string;
  dateOfTransfer: string;
  invoiceNumber: string;
  purposeCode: string;
}

const initialState: PaymentDetailsState = {
  remittanceAmount: '',
  currency: 'USD',
  dateOfTransfer: '',
  invoiceNumber: '',
  purposeCode: '',
};

const paymentDetailsSlice = createSlice({
  name: 'paymentDetails',
  initialState,
  reducers: {
    saveBankDetails(state, action: PayloadAction<PaymentDetailsState>) {
      state.remittanceAmount = action.payload.remittanceAmount;
      state.currency = action.payload.currency;
      state.dateOfTransfer = action.payload.dateOfTransfer;
      state.invoiceNumber = action.payload.invoiceNumber;
      state.purposeCode = action.payload.purposeCode;
    },
    clearPaymentDetails(state) {
      state.remittanceAmount = '';
      state.currency = 'USD';
      state.dateOfTransfer = '';
      state.invoiceNumber = '';
      state.purposeCode = '';
    },
  },
});

export const { saveBankDetails, clearPaymentDetails } = paymentDetailsSlice.actions;

export default paymentDetailsSlice.reducer;
