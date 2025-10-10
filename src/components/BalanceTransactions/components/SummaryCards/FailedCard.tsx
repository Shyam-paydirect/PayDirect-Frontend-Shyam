import React from "react";
import { XCircle } from "lucide-react";
import "../../BalanceTransactionsPage.css"; // ✅ make sure path is correct

interface FailedCardProps {
  failed: string | number;
}

const FailedCard: React.FC<FailedCardProps> = ({ failed }) => (
  <div className="summary-card">
    <div className="summary-card-content">
      <div className="summary-card-info">
        <p>Failed</p>
        <p className="text-red">{failed}</p>
      </div>
      <div className="summary-card-icon icon-red">
        <XCircle />
      </div>
    </div>
  </div>
);

export default FailedCard;
