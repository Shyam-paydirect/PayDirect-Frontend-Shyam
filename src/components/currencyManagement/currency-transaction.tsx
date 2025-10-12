// CurrencyTransactions.tsx (Currency Transactions Component)
import React, {useState} from 'react';
import { Typography, Divider } from '@mui/material';
import './currency-management.css';
import SendPaymentModal from '../orderbook/sendPaymentOrder';
import ReceivablesFormModal from '../Receivables/ReceivablesFormModal';
import { useRouter } from 'next/router';
import { setCurrentDashboard } from '@/app/redux/slices/dashboardSlice';
import { useSelector, useDispatch } from 'react-redux';

const CurrencyTransactions: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReceivablesModalOpen, setIsReceivablesModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleOpen = () =>     {
    localStorage.setItem("prev_component", 'currency-management')
    dispatch(setCurrentDashboard('payment-details'));
  }
  const handleClose = () => setIsModalOpen(false);

  return (
    <>
      <div className="trade-payments-parent commonCard">
        <section className="heading">
          <div className="cardHeading">
            Payment
          </div>
        </section>
        <Divider />
        {/* Trade Payments Buttons */}
        <div className="trade-payments commonCard">
          <button className="payment" onClick={handleOpen}>
            <img
              src="assets/svg/common/dollar-send.svg"
              alt="Send Payment" 
              className="currency-icon"
            />
            <div className="payment-text"><span>Send</span><span> Payment</span></div>
          </button>
          <button className="payment" onClick={() => setIsReceivablesModalOpen(true)}>
            <img
              src="assets/svg/common/dollar-receive.svg"
              alt="Receive Payment"
              className="currency-icon"
            />
            <div className="payment-text"><span>Receive</span><span> Payment</span></div>
          </button>
        </div>
      </div>
      <SendPaymentModal isOpen={isModalOpen} onClose={handleClose} />
      <ReceivablesFormModal 
        open={isReceivablesModalOpen} 
        onClose={() => setIsReceivablesModalOpen(false)} 
      />
    </>
  );
};

export default CurrencyTransactions;
