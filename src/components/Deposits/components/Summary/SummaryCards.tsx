import React from 'react';
import SummaryCard from './SummaryCard';

interface Stats {
  totalDeposits: number;
  totalAmount: number;
  completed: number;
  pending: number;
}

interface SummaryCardsProps {
  stats: Stats;
  formatAmount: (amount: number, currency: string) => string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ stats, formatAmount }) => {
  return (
    <div className="summary-grid">
      <SummaryCard title="Total Deposits : " value={stats.totalDeposits} />
      <SummaryCard title="Total Amount : " value={formatAmount(stats.totalAmount, 'INR')} />
      <SummaryCard title="Completed : " value={stats.completed} />
      <SummaryCard title="Pending : " value={stats.pending} />
    </div>
  );
};

export default SummaryCards;
