"use client"

// Main.tsx (Main layout including SideNavbar and TopNavbar)
import React, { useEffect, useState } from 'react';
import SideNavbar from '@/components/sideNavbar/side-navbar';
import TopNavbar from '@/components/top-navbar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import "./main.css";
import "@/styles/global.css";
import GeneralLedger from '@/components/general-ledger';
import CurrencyManagement from '@/components/currencyManagement/currency-management';
import FinancialReporting from '@/components/financial-reporting/financial-reporting';

import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import PaymentDetails from '@/components/paymentDetails/payment-details';
import OrderPaymentComponent from '@/components/orderbook/orderbook';

const Main: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true);
    if(!Cookies.get("token")){
      router.push("/")
    }
  }, [router])

  const dashboardTitle = useSelector((state: RootState) => state.dashboard.currentDashboard)
  // const [currentDashboard, setCurrentDashboard] = useState<string>('general-ledger');
  
  const renderDashboard = () => {
    if (!isClient) {
      return <div></div>; // Prevent SSR rendering mismatch
  }
    switch (dashboardTitle) {
      case 'currency-management':
        return <CurrencyManagement />;
      case 'general-ledger':
        return <GeneralLedger />;
      case 'financial-reporting':
        return <FinancialReporting />;
      case 'order-book':
        return <OrderPaymentComponent />
      case 'payment-details':
        return <PaymentDetails />;
      default:
        return <CurrencyManagement />;
    }
  };

  return (  
    <div className="app-container">
      <SideNavbar/>
      <div className="content">
        <TopNavbar/>
        <div className="dashboard-content">
          {renderDashboard()}
        </div>
      </div>
    </div>
  );
};

export default Main;