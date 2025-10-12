import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconClass?: string;
  valueClass?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, iconClass = '', valueClass = '' }) => {
  return (
    <div className="summary-card">
      <div className="summary-card-content">
        <div className="summary-card-info">
          <p>{title}</p>
          <p className={valueClass}>{value}</p>
        </div>
        <div className={`summary-card-icon ${iconClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
