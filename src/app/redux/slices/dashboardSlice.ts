import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  currentDashboard: string;
  dashboardTitle: string;
}

const initialState: DashboardState = {
  currentDashboard: 'currency-management',
  dashboardTitle: 'Currency Management',
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
      return 'Currency Management';
    case 'general-ledger':
      return 'General Ledger';
    case 'financial-reporting':
      return 'Financial Analytics';
    case 'order-book':
      return 'Order Book';
    case 'payment-details':
      return 'Payment Details';
    case 'accounts':
      return 'Accounts';
    default:
      return 'Currency Management';
  }
}

export const { setCurrentDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
