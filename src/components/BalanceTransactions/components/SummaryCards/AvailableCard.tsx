import React from "react";
import { CheckCircle } from "lucide-react";
import "../../BalanceTransactionsPage.css"; // ✅ Correct relative path

interface AvailableCardProps {
  available: string | number;
}

const AvailableCard: React.FC<AvailableCardProps> = ({ available }) => (
  <div className="summary-card">
    <div className="summary-card-content">
      <div className="summary-card-info">
        <p>Available</p>
        <p className="text-green">{available}</p>
      </div>
      <div className="summary-card-icon icon-green">
        <CheckCircle />
      </div>
    </div>
  </div>
);

export default AvailableCard;
