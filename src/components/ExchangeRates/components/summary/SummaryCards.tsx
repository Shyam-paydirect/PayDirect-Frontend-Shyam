import React from "react";
import SummaryCard from "./SummaryCard";

interface SummaryStats {
  conversion: string | number;
  increase?: string | number;
}

interface SummaryCardsProps {
  stats: SummaryStats;
  formatAmount?: (amount: number, currency?: string) => string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ stats, formatAmount }) => {
  return (
    <div className="summary-grid">
      <SummaryCard title="USD → EUR :" value={stats.conversion} increase={stats.increase} />
      <SummaryCard title="USD → INR :" value={stats.conversion} increase={stats.increase} />
      <SummaryCard title="EUR → GBP :" value={stats.conversion} increase={stats.increase} />
    </div>
  );
};

export default SummaryCards;
