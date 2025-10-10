import React from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  increase?: string | number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, increase }) => {
  return (
    <div className="summary-card">
      <span className="summary-title">{title}</span>
      <span className="summary-value">{value}</span>
      {increase !== undefined && (
        <span className="summary-increase">{increase}</span>
      )}
    </div>
  );
};

export default SummaryCard;
