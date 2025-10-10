import { UsersIcon } from "@heroicons/react/24/solid";
import { formatCurrency } from "../formatCurrency";
import { getCurrencyFlag } from "../getCurrencyFlag";

export interface PendingItem {
  currency: string;
  amount: number;
}

export interface AggregateBalanceWidgetProps {
  aggregateData: {
    pending: PendingItem[];
  };
}

export const AggregateBalanceWidget: React.FC<AggregateBalanceWidgetProps> = ({
  aggregateData,
}) => {
  if (!aggregateData) return null;

  return (
    <div className="aggregate-widget">
      <div className="aggregate-widget__header">
        <UsersIcon className="aggregate-widget__icon" />
        <h2 className="aggregate-widget__title">Platform Aggregate View</h2>
      </div>

      <div className="aggregate-widget__grid">
        {aggregateData.pending.map((item) => (
          <div key={item.currency} className="aggregate-widget__card">
            <div className="aggregate-widget__card-label">
              Total Pending – {getCurrencyFlag(item.currency)} {item.currency}
            </div>
            <div className="aggregate-widget__card-amount">
              {formatCurrency(item.amount, item.currency)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
