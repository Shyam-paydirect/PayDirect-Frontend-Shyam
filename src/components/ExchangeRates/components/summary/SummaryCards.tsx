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
    <div className="summary-cards">
      <SummaryCard 
        title="USD → EUR" 
        value={stats.conversion} 
        increase={stats.increase} 
        iconClass="icon-blue"
        icon={
          <>
            <span className="currency-symbol">$</span>
            <span className="arrow">→</span>
            <span className="currency-symbol">€</span>
          </>
        }
      />
      <SummaryCard 
        title="USD → INR" 
        value={stats.conversion} 
        increase={stats.increase} 
        iconClass="icon-green"
        icon={
          <>
            <span className="currency-symbol">$</span>
            <span className="arrow">→</span>
            <span className="currency-symbol">₹</span>
          </>
        }
      />
      <SummaryCard 
        title="EUR → GBP" 
        value={stats.conversion} 
        increase={stats.increase} 
        iconClass="icon-yellow"
        icon={
          <>
            <span className="currency-symbol">€</span>
            <span className="arrow">→</span>
            <span className="currency-symbol">£</span>
          </>
        }
      />
    </div>
  );
};

export default SummaryCards;
