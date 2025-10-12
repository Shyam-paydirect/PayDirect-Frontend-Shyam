import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import StepByStepPaymentForm from '../components/Receivables/StepByStepPaymentForm';
import SideNavbar from '../components/sideNavbar/side-navbar';
import TopNavbar from '../components/top-navbar';
import '../pages/dashboard/main.css';

const PaymentFormPage: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="app-container">
      <SideNavbar />
      <div className="content">
        <TopNavbar />
        
        {/* Back Button */}
        <div className="back-button-container" style={{ margin: "20px 0" }}>
          <button
            className="back-button"
            style={{
              display: "flex",
              alignItems: "center",
              background: "white",
              borderRadius: "5px",
              padding: "12px",
              fontSize: "14px",
              cursor: "pointer",
              marginLeft: '20px',
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            onClick={handleBack}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ width: "20px", height: "20px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Payment Form Content */}
        <div className="dashboard-content">
          <StepByStepPaymentForm onClose={handleBack} />
        </div>
      </div>
    </div>
  );
};

// Disable SSR for this component
export default dynamic(() => Promise.resolve(PaymentFormPage), { ssr: false });
