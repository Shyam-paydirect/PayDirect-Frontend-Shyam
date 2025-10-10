import React from "react";
import SummaryCard from "./SummaryCard";

type Stats = {
  totalPayouts: number | string;
  totalAmount: number | string;
  Completed: number;
  Pending: number;
  Failed: number;
};

type SummaryCardsProps = {
  stats: Stats;
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  return (
    <div className="summary-grid">
      <SummaryCard
        title="Total Payouts :  "
        value={stats.totalPayouts}
      />
      <SummaryCard
        title="Total Amount Paid : "
        value={stats.totalAmount}
      />
      <SummaryCard
        title="Status Breakdown : "
        value={`${stats.Completed} ✅ /  ${stats.Pending} ⏳ /  ${stats.Failed} ❌`}
      />
    </div>
  );
};

export default SummaryCards;
