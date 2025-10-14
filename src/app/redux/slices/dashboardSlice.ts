import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  currentDashboard: string;
  dashboardTitle: string;
  paymentsMode: 'send' | 'receive';
}

const initialState: DashboardState = {
  currentDashboard: 'currency-management',
  dashboardTitle: 'Payments',
  paymentsMode: 'send',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setCurrentDashboard(state, action: PayloadAction<string>) {
      if (typeof window !== 'undefined') {
        localStorage.setItem("component", action.payload);
      }
      state.currentDashboard = action.payload;
      state.dashboardTitle = getTitleByDashboard(action.payload);
    },
    setPaymentsMode(state, action: PayloadAction<'send' | 'receive'>) {
      state.paymentsMode = action.payload;
      // Persist the last chosen mode for future sessions
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('paymentsMode', action.payload);
        } catch {}
      }
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
    case 'track-payments':
      return 'Track Payments'
    case 'accounts':
      return 'Accounts';
    case 'document-uploads':
      return 'Document Uploads';
    case 'document-viewer':
      return 'Document Viewer'
    case 'account-statement':
      return 'Account Statement';
    case 'manage-users':
      return 'Manage Users';
    case 'change-password':
      return 'Change Password';
    case 'request-letter':
      return 'Request Letter';
    case 'partner-account':
      return 'Create Partner Account';
    case 'recievables-dashboard':
      return 'Receivables Dashboard';
    case 'balances-dashboard':
      return 'Balances Dashboard';
    case 'balance-transactions':
      return 'Balance Transactions';
    case 'deposits-dashboard':
      return 'Deposits Dashboard';
    case 'exchange-rates':
      return 'Exchange Rates Dashboard';
    case 'payouts-dashboard':
      return 'Payouts Dashboard';
    default:
      return 'Payments';
  }
}

export const { setCurrentDashboard } = dashboardSlice.actions;
export const { setPaymentsMode } = dashboardSlice.actions;
export default dashboardSlice.reducer;
