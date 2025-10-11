import React from "react";
import SummaryCard from "./SummaryCard";

type Stats = {
  totalReceivables: number;
  totalAmount: number;
  Confirmed?: number;
  Pending?: number;
  Cancelled?: number;
};

type SummaryCardsProps = {
  stats: Stats;
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  return (
    <div className="summary-grid">
      {/* Total Receivables */}
      <SummaryCard title="Total Receivables : " value={stats.totalReceivables} />

      {/* Total Amount Expected */}
      <SummaryCard title="Total Amount Expected : " value={stats.totalAmount} />

      {/* Status Breakdown */}
      <SummaryCard
        title="Status Breakdown : "
        value={`${stats.Confirmed || 0} ✅ / ${stats.Pending || 0} ⏳ / ${stats.Cancelled || 0} ❌`}
      />
    </div>
  );
};

export default SummaryCards;
