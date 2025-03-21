"use client";

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { setCurrentDashboard } from '@/app/redux/slices/dashboardSlice';
import "./main.css";
import "@/styles/global.css";
import AccountStatement from '@/components/account-statement/account-statement';
import ChangePassword from '@/components/change-password/change-password';

// Dynamically import all components with ssr: false
const SideNavbar = dynamic(() => import('@/components/sideNavbar/side-navbar'), { ssr: false });
const TopNavbar = dynamic(() => import('@/components/top-navbar'), { ssr: false });
const CurrencyManagement = dynamic(() => import('@/components/currencyManagement/currency-management'), { ssr: false });
const FinancialReporting = dynamic(() => import('@/components/financial-reporting/financial-reporting'), { ssr: false });
const PaymentDetails = dynamic(() => import('@/components/paymentDetails/payment-details'), { ssr: false });
const OrderPaymentComponent = dynamic(() => import('@/components/orderbook/orderbook'), { ssr: false });
const Accounts = dynamic(() => import('@/components/account-details/account-details'), { ssr: false });
const DocumentUploads = dynamic(() => import('@/components/documents-upload/documents-upload'), { ssr: false });
const DocumentViewer = dynamic(() => import('@/components/documents-upload/document-viewer'), { ssr: false });
const FxRateBooker = dynamic(() => import('@/components/fx-rate-booking'), { ssr: false });
const TrackPayments = dynamic(() => import('@/components/track-payment'), { ssr: false });

const Main: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!Cookies.get("token")) {
      window.location.href = '/';
    }
  }, [router]);

  const dispatch = useDispatch();
  const dashboardTitle = useSelector((state: RootState) => state.dashboard.currentDashboard);
  const previousDashboard = localStorage.getItem('prev_component') || 'currency-management';
  const currentDashboard = localStorage.getItem('component') || '';
  const mainDashboards = ['currency-management', 'financial-reporting', 'order-book', 'accounts'];

  const renderDashboard = () => {
    if (!isClient) {
      return <div></div>; // Prevent SSR rendering mismatch
    }
    switch (dashboardTitle) {
      case 'currency-management':
        return <CurrencyManagement />;
      case 'financial-reporting':
        return <FinancialReporting />;
      case 'order-book':
        return <OrderPaymentComponent />;
      case 'payment-details':
        return <PaymentDetails />;
      case 'accounts':
        return <Accounts />;
      case 'fx-rate-booker':
        return <FxRateBooker />;
      case 'track-payments':
        return <TrackPayments />;
      case 'document-uploads':
        return <DocumentUploads />;
      case 'document-viewer':
        return <DocumentViewer />;
      case 'account-statement':
        return <AccountStatement />;
      case 'change-password':
        return <ChangePassword />;
      default:
        localStorage.setItem("prev_component", 'currency-management');
        return <CurrencyManagement />;
    }
  };

  return (
    <div className="app-container">
      <SideNavbar />
      <div className="content">
        <TopNavbar />
        <div className="back-button-container" style={{ margin: "20px 0" }}>
          {!mainDashboards.includes(currentDashboard) && (
            <button
              className="back-button"
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "8px 12px",
                fontSize: "14px",
                cursor: "pointer",
                marginLeft: '8px',
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => dispatch(setCurrentDashboard(previousDashboard))}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ width: "16px", height: "16px", marginRight: "8px" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          )}
        </div>
        <div className="dashboard-content">
          {renderDashboard()}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Main), { ssr: false }); // Disable SSR for Main
