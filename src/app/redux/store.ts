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
import documentReducer from './slices/api/documentSlice';
import accountsReducer from './slices/api/accountsSlice';
import forgotPasswordReducer from './slices/api/forgotPasswordSlice';
import uploadFinalDocsReducer from './slices/api/uploadFinalDocs';
import accountBalanceReducer from './slices/api/accountBalanceSlice'
import userNotificationReducer from './slices/api/notificationSlice'
import userManagementReducer from './slices/api/userManagementSlice'
import ccyPairReducer from './slices/api/ccyPairSlice'

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
    accounts: accountsReducer,
    forgotPassword: forgotPasswordReducer,
    uploadFinalDocs: uploadFinalDocsReducer,
    accountBalance: accountBalanceReducer,
    userNotification: userNotificationReducer,
    userManagement: userManagementReducer,
    ccyPair: ccyPairReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
