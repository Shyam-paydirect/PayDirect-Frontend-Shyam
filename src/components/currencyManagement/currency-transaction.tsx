// CurrencyTransactions.tsx (Currency Transactions Component)
import React from 'react';
import { Typography, Divider } from '@mui/material';
import './currency-management.css';

const CurrencyTransactions: React.FC = () => {
  return (
    <div className="trade-payments-parent commonCard">
      <section className="heading">
        <Typography variant="h5" className="cardHeading">
          Payment
        </Typography>
      </section>
      <Divider />
      {/* Trade Payments Buttons */}
      <div className="trade-payments commonCard">
        <button className="payment">
          <img
            src="assets/svg/common/dollar-send.svg"
            alt="Receive Payment"
            className="currency-icon"
          />
          <div className="payment-text"><span>Send</span><span> Payment</span></div>
        </button>
        <button className="payment">
          <img
            src="assets/svg/common/dollar-receive.svg"
            alt="Receive Payment"
            className="currency-icon"
          />
          <div className="payment-text"><span>Receive</span><span> Payment</span></div>
        </button>
      </div>
    </div>
  );
};

export default CurrencyTransactions;
