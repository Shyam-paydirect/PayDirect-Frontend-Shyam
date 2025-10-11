import React from "react";

type SummaryCardProps = {
  title: string;
  value: string | number;
  subtitle?: string | number;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle }) => {
  return (
    <div className="summary-card">
      <span className="summary-title">{title}</span>
      <span className="summary-value">{value}</span>
      {subtitle && <span className="summary-value">{subtitle}</span>}
    </div>
  );
};

export default SummaryCard;
