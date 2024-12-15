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

const Main: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if(!Cookies.get("token")){
      router.push("/")
    }
  }, [])

  const dashboardTitle = useSelector((state: RootState) => state.dashboard.currentDashboard)
  // const [currentDashboard, setCurrentDashboard] = useState<string>('general-ledger');
  
  const renderDashboard = () => {
    switch (dashboardTitle) {
      case 'currency-management':
        return <CurrencyManagement />;
      case 'general-ledger':
        return <GeneralLedger />;
      case 'financial-reporting':
        return <FinancialReporting />;
      case 'admin-portal':
        // return <AdminPortal />;
      default:
        // return <GeneralLedger />;
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