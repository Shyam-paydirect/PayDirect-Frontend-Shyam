import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  currentDashboard: string;
  dashboardTitle: string;
}

const initialState: DashboardState = {
  currentDashboard: 'general-ledger',
  dashboardTitle: 'General Ledger',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setCurrentDashboard(state, action: PayloadAction<string>) {
      console.log("Dashboard");
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
      return 'Financial Reporting';
    case 'payment-details':
      return 'Payment Details';
    case 'admin-portal':
      return 'Admin Portal';
    default:
      return 'General Ledger';
  }
}

export const { setCurrentDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
