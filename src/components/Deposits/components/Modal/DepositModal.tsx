import React from 'react';
import MetadataList, { DepositMetadata } from './MetadataList';

export interface Deposit {
  id: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  createdAt: string;
  amount: number;
  currency: 'INR' | 'USD';
  metadata: DepositMetadata[];
}

interface DepositModalProps {
  deposit: Deposit | null;
  onClose: () => void;
  formatDate: (dateStr: string) => string;
  formatAmount: (amount: number, currency: string) => string;
}

const DepositModal: React.FC<DepositModalProps> = ({
  deposit,
  onClose,
  formatDate,
  formatAmount,
}) => {
  if (!deposit) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Deposit Details</h2>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className={`status-badge ${
            deposit.status === 'completed'
              ? 'status-completed'
              : deposit.status === 'pending'
              ? 'status-pending'
              : 'status-failed'
          }`}>
            {deposit.status}
          </div>

          <div className="modal-grid">
            <div className="modal-info-box">
              <div className="modal-info-label">Deposit ID</div>
              <div className="modal-info-value">{deposit.id}</div>
            </div>
            <div className="modal-info-box">
              <div className="modal-info-label">Payment Method</div>
              <div className="modal-info-value">{deposit.paymentMethod}</div>
            </div>
            <div className="modal-info-box">
              <div className="modal-info-label">Date</div>
              <div className="modal-info-value">{formatDate(deposit.createdAt)}</div>
            </div>
          </div>

          <div className="modal-amount-box">
            <div className="modal-amount-label">Amount</div>
            <div className="modal-amount-value">
              {formatAmount(deposit.amount, deposit.currency)}
            </div>
            <div className="modal-amount-currency">{deposit.currency}</div>
          </div>

          <div className="modal-section">
            <h3>Metadata</h3>
            <MetadataList metadata={deposit.metadata} />
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
