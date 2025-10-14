// CurrencyTransactions.tsx (Currency Transactions Component)
import React, {useState} from 'react';
import { Typography, Divider } from '@mui/material';
import './currency-management.css';
import SendPaymentModal from '../orderbook/sendPaymentOrder';
import ReceivablesFormModal from '../Receivables/ReceivablesFormModal';
import PaymentDetailsModal from '../paymentDetails/payment-details-modal';
import { useRouter } from 'next/router';
import { setCurrentDashboard, setPaymentsMode } from '@/app/redux/slices/dashboardSlice';
import { useSelector, useDispatch } from 'react-redux';

const CurrencyTransactions: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReceivablesModalOpen, setIsReceivablesModalOpen] = useState(false);
  const [isPaymentDetailsModalOpen, setIsPaymentDetailsModalOpen] = useState(false);
  const dispatch = useDispatch();
  
  // Get current payments mode from Redux store
  const paymentsMode = useSelector((state: any) => state.dashboard.paymentsMode);

  const handleSendSingleClick = () => {
    // Single click: just switch to send mode to show corresponding tabs
    // eslint-disable-next-line
    (dispatch as any)(setPaymentsMode('send'));
  };

  const handleSendDoubleClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("prev_component", 'currency-management')
    }
    // Double click: switch to send mode and open payment details modal
    // eslint-disable-next-line
    (dispatch as any)(setPaymentsMode('send'));
    setIsPaymentDetailsModalOpen(true);
  };
  const handleClose = () => setIsModalOpen(false);

  const handleReceiveSingleClick = () => {
    // Single click: just switch to receive mode to show corresponding tabs
    // eslint-disable-next-line
    (dispatch as any)(setPaymentsMode('receive'));
  };

  const handleReceiveDoubleClick = () => {
    // Double click: switch to receive mode and open receivables form modal
    // eslint-disable-next-line
    (dispatch as any)(setPaymentsMode('receive'));
    setIsReceivablesModalOpen(true);
  };

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
          <button 
            className={`payment ${paymentsMode === 'send' ? 'active' : ''}`} 
            onClick={handleSendSingleClick}
            onDoubleClick={handleSendDoubleClick}
            style={{
              backgroundColor: paymentsMode === 'send' ? '#e3f2fd' : '',
              border: paymentsMode === 'send' ? '2px solid #1976d2' : '',
              boxShadow: paymentsMode === 'send' ? '0 2px 8px rgba(25, 118, 210, 0.3)' : ''
            }}
          >
            <img
              src="assets/svg/common/dollar-send.svg"
              alt="Send Payment" 
              className="currency-icon"
            />
            <div className="payment-text"><span>Send</span><span> Payment</span></div>
          </button>
          <button 
            className={`payment ${paymentsMode === 'receive' ? 'active' : ''}`} 
            onClick={handleReceiveSingleClick}
            onDoubleClick={handleReceiveDoubleClick}
            style={{
              backgroundColor: paymentsMode === 'receive' ? '#e3f2fd' : '',
              border: paymentsMode === 'receive' ? '2px solid #1976d2' : '',
              boxShadow: paymentsMode === 'receive' ? '0 2px 8px rgba(25, 118, 210, 0.3)' : ''
            }}
          >
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
      <PaymentDetailsModal 
        open={isPaymentDetailsModalOpen} 
        onClose={() => setIsPaymentDetailsModalOpen(false)} 
      />
    </>
  );
};

export default CurrencyTransactions;
