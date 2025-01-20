import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  currentDashboard: string;
  dashboardTitle: string;
}

const initialState: DashboardState = {
  currentDashboard: 'currency-management',
  dashboardTitle: 'Payments',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setCurrentDashboard(state, action: PayloadAction<string>) {
      state.currentDashboard = action.payload;
      state.dashboardTitle = getTitleByDashboard(action.payload);
    },
  },
});

function getTitleByDashboard(dashboard: string): string {
  switch (dashboard) {
    case 'currency-management':
      return 'Payments';
    case 'general-ledger':
      return 'General Ledger';
    case 'financial-reporting':
      return 'Financial Analytics';
    case 'order-book':
      return 'Order Book';
    case 'payment-details':
      return 'Payment Details';
    case 'fx-rate-booker':
      return 'Book FX Rate'
    case 'accounts':
      return 'Accounts';
    case 'document-uploads':
      return 'Document Uploads';
    default:
      return 'Payments';
  }
}

export const { setCurrentDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
