import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import uiReducer from './slices/uiSlice';
import fxRateReducer from './slices/api/fxRateSlice';
import authReducer from './slices/api/authSlice';
import paymentReducer from './slices/paymentDetailsSlice'
import ttPaymentReducer from './slices/api/ttPaymentSlice';
import orderReducer from './slices/api/orderSlice';
import fileUploadReducer from './slices/api/fileUploadSlice';
import txnOtpReducer from './slices/api/txnOtpSlice';
import documentReducer from './slices/api/documentSlice'

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    ui: uiReducer,
    fxRate: fxRateReducer,
    auth: authReducer,
    paymentDetails: paymentReducer,
    ttPayment: ttPaymentReducer,
    orders: orderReducer,
    fileUpload: fileUploadReducer,
    txnOtp: txnOtpReducer,
    documents: documentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
