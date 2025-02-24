import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentDetailsState {
  paymentDetails: {
    remittanceAmount: string;
    currency: string;
    dateOfTransfer: string;
    invoiceNumber: string;
    purposeCode: string;
  };
  bankDetails: {
    swiftCode: string;
    beneficiaryBank: string;
    bankAddress: string;
    city: string;
    state: string;
    country: string;
    beneficiaryName: string;
    beneficiaryAccountNumber: string;
    micrCode: string;
    senderName: string;
    senderAccNo: string;
    senderBic: string;
  };
}

const initialState: PaymentDetailsState = {
  paymentDetails: {
    remittanceAmount: '',
    currency: 'USD',
    dateOfTransfer: '',
    invoiceNumber: '',
    purposeCode: '',
  },
  bankDetails: {
    swiftCode: '',
    beneficiaryBank: '',
    bankAddress: '',
    city: '',
    state: '',
    country: '',
    beneficiaryName: '',
    beneficiaryAccountNumber: '',
    micrCode: '',
    senderName: '',
    senderAccNo: '',
    senderBic: ''
  },
};

const paymentDetailsSlice = createSlice({
  name: 'paymentDetails',
  initialState,
  reducers: {
    savePaymentDetails(state, action: PayloadAction<PaymentDetailsState['paymentDetails']>) {
      state.paymentDetails = action.payload;
    },
    saveBankDetails(state, action: PayloadAction<PaymentDetailsState['bankDetails']>) {
      state.bankDetails = action.payload;
    },
    clearPaymentDetails(state) {
      state.paymentDetails = {
        remittanceAmount: '',
        currency: 'USD',
        dateOfTransfer: '',
        invoiceNumber: '',
        purposeCode: '',
      };
      state.bankDetails = {
        swiftCode: '',
        beneficiaryBank: '',
        bankAddress: '',
        city: '',
        state: '',
        country: '',
        beneficiaryName: '',
        beneficiaryAccountNumber: '',
        micrCode: '',
        senderName: '',
        senderAccNo: '',
        senderBic: ''
      };
    },
  },
});

export const { savePaymentDetails, saveBankDetails, clearPaymentDetails } = paymentDetailsSlice.actions;

export default paymentDetailsSlice.reducer;
