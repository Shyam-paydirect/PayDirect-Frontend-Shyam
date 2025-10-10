import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => {
  return (
    <div className="summary-card">
      <span className="summary-title">{title}</span>
      <span className="summary-value">{value}</span>
    </div>
  );
};

export default SummaryCard;
