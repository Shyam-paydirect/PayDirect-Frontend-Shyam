import React from "react";
import { X } from "lucide-react";
import {
  formatDate,
  formatAmount,
  getStatusColor,
  getStatusIcon,
  getTypeColor,
} from "../transactionHelpers";

// ✅ Local Transaction type
export interface Transaction {
  id: string | number;
  date: string;
  type: string;
  amount: number | string;
  currency: string;
  status: string;
  reference?: string;
  fee?: number | string;
  balanceImpact?: string | number;
  description?: string;
}

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  // Ensure amounts are numbers
  const amount =
    typeof transaction.amount === "string"
      ? parseFloat(transaction.amount)
      : transaction.amount;
  const fee =
    typeof transaction.fee === "string"
      ? parseFloat(transaction.fee)
      : transaction.fee || 0;

  // Render status icon safely
  const StatusIcon = getStatusIcon(transaction.status);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2>Transaction Details</h2>
          <button onClick={onClose} className="close-button">
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Status + Amount */}
          <div className="status-amount">
            <span className={`status-badge ${getStatusColor(transaction.status)}`}>
              {StatusIcon && <StatusIcon className="status-icon" />}
              {transaction.status.toUpperCase()}
            </span>
            <span
              className={`transaction-amount ${
                amount >= 0 ? "amount-positive" : "amount-negative"
              }`}
            >
              {amount >= 0 ? "+" : "-"}
              {formatAmount(amount, transaction.currency)}
            </span>
          </div>

          {/* Details Grid */}
          <div className="details-grid">
            <div>
              <p className="label">Transaction ID</p>
              <p className="value">{transaction.id}</p>
            </div>
            <div>
              <p className="label">Reference</p>
              <p className="value">{transaction.reference || "-"}</p>
            </div>
            <div>
              <p className="label">Date & Time</p>
              <p className="value">{formatDate(transaction.date)}</p>
            </div>
            <div>
              <p className="label">Type</p>
              <p className={`value ${getTypeColor(transaction.type)}`}>
                {transaction.type}
              </p>
            </div>
            <div>
              <p className="label">Currency</p>
              <p className="value">{transaction.currency}</p>
            </div>
            <div>
              <p className="label">Fee</p>
              <p className="value fee">-{formatAmount(fee, transaction.currency)}</p>
            </div>
            <div className="col-span-2">
              <p className="label">Balance Impact</p>
              <p className="value">
                {transaction.balanceImpact ?? "-"} Balance
              </p>
            </div>
            <div className="col-span-2">
              <p className="label">Description</p>
              <p className="value">{transaction.description || "-"}</p>
            </div>
          </div>

          {/* Net Amount */}
          <div className="net-amount-section">
            <span className="label">Net Amount</span>
            <span
              className={`transaction-amount ${
                amount >= 0 ? "amount-positive" : "amount-negative"
              }`}
            >
              {amount >= 0 ? "+" : "-"}
              {formatAmount(Math.abs(amount) - fee, transaction.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
