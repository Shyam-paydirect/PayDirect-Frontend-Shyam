import { FC } from "react";
import { formatCurrency } from "../formatCurrency";

// Props interface
interface SummaryCardProps {
  category: string;
  total: number;
  currency: string;
  color?: string; // optional CSS class for color
  icon: FC<{ className?: string }>; // React component for icon
}

export const SummaryCard: FC<SummaryCardProps> = ({
  category,
  total,
  currency,
  color = "bg-gray-500",
  icon: Icon,
}) => {
  return (
    <div className="summary-card card">
      <div className="summary-card__header">
        <div className={`summary-card__icon ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="summary-card__value">{formatCurrency(total, currency)}</div>

      <div className="summary-card__label">{category}</div>
    </div>
  );
};
