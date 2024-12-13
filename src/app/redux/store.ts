import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import uiReducer from './slices/uiSlice';
import fxRateReducer from './slices/api/fxRateSlice';
import authReducer from './slices/api/authSlice';


export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    ui: uiReducer,
    fxRate: fxRateReducer,
    auth: authReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
