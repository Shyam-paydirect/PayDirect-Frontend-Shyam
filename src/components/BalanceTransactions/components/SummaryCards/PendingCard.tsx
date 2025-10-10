import React from "react";
import { Clock } from "lucide-react";
import "../../BalanceTransactionsPage.css"; // ✅ correct relative path

interface PendingCardProps {
  pending: string | number;
}

const PendingCard: React.FC<PendingCardProps> = ({ pending }) => (
  <div className="summary-card">
    <div className="summary-card-content">
      <div className="summary-card-info">
        <p>Pending</p>
        <p className="text-yellow">{pending}</p>
      </div>
      <div className="summary-card-icon icon-yellow">
        <Clock />
      </div>
    </div>
  </div>
);

export default PendingCard;
