import React from "react";
import TotalTransactionsCard from "./TotalTransactionsCard";
import AvailableCard from "./AvailableCard";
import PendingCard from "./PendingCard";
import FailedCard from "./FailedCard";
import "../../BalanceTransactionsPage.css"; // ✅ use shared styles

// Define the shape of a transaction
export interface Transaction {
  status: "available" | "pending" | "failed" | string;
  [key: string]: any;
}

interface SummaryCardsProps {
  transactions: Transaction[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ transactions }) => {
  const total = transactions.length;
  const available = transactions.filter((t) => t.status === "available").length;
  const pending = transactions.filter((t) => t.status === "pending").length;
  const failed = transactions.filter((t) => t.status === "failed").length;

  return (
    <div className="summary-cards">
      <TotalTransactionsCard total={total} />
      <AvailableCard available={available} />
      <PendingCard pending={pending} />
      <FailedCard failed={failed} />
    </div>
  );
};

export default SummaryCards;
