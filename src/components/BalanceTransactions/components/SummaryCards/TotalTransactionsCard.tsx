import React from "react";
import { Receipt } from "lucide-react";
import "../../BalanceTransactionsPage.css"; // ✅ shared stylesheet

interface TotalTransactionsCardProps {
  total: number;
}

const TotalTransactionsCard: React.FC<TotalTransactionsCardProps> = ({ total }) => (
  <div className="summary-card">
    <div className="summary-card-content">
      <div className="summary-card-info">
        <p>Total Transactions</p>
        <p>{total}</p>
      </div>
      <div className="summary-card-icon">
        <Receipt />
      </div>
    </div>
  </div>
);

export default TotalTransactionsCard;
