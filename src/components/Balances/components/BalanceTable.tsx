import { FC } from "react";
import { BalanceTableRow } from "./BalanceTableRow";
import { EmptyBalanceState } from "./EmptyBalanceState";

// Define the shape of a balance entry
interface BalanceItem {
  currency: string;
  amount: number | string;
}

// Define possible balance categories
interface BalanceCategory {
  available?: BalanceItem[];
  pending?: BalanceItem[];
  processing?: BalanceItem[];
  payout_processing?: BalanceItem[];
  fee_advance?: BalanceItem[];
  [key: string]: BalanceItem[] | undefined;
}

// Define the totals by currency
interface CurrencyTotals {
  [currency: string]: {
    available: number;
    pending: number;
    processing: number;
    payout_processing: number;
    fee_advance: number;
  };
}

// Props type
interface BalanceTableProps {
  balanceData: BalanceCategory;
}

export const BalanceTable: FC<BalanceTableProps> = ({ balanceData }) => {
  // Helper to compute totals
  const getTotalByCurrency = (balances: BalanceCategory): CurrencyTotals => {
    const totals: CurrencyTotals = {};

    Object.keys(balances).forEach((category) => {
      const items = balances[category];
      if (Array.isArray(items)) {
        items.forEach((item) => {
          if (!totals[item.currency]) {
            totals[item.currency] = {
              available: 0,
              pending: 0,
              processing: 0,
              payout_processing: 0,
              fee_advance: 0,
            };
          }

          // Use type assertion since category is dynamic
          if (category in totals[item.currency]) {
            (totals[item.currency] as any)[category] = parseFloat(
              item.amount as string
            );
          }
        });
      }
    });

    return totals;
  };

  const currencyTotals = getTotalByCurrency(balanceData);
  const currencies = Object.keys(currencyTotals);

  return (
    <div className="balance-table-container">
      {/* Table Header */}
      <div className="balance-table__header">
        <h2 className="balance-table__title">Balance Breakdown by Currency</h2>
      </div>

      {currencies.length === 0 ? (
        <EmptyBalanceState />
      ) : (
        <div className="balance-table__wrapper">
          <table className="balance-table">
            <thead className="balance-table__head">
              <tr>
                <th>Currency</th>
                <th>Available</th>
                <th>Pending</th>
                <th>Processing</th>
                <th>Payout Processing</th>
                <th>Fee Advance</th>
              </tr>
            </thead>
            <tbody className="balance-table__body">
              {currencies.map((currency, index) => (
                <BalanceTableRow
                  key={currency}
                  currency={currency}
                  balances={currencyTotals[currency]}
                  isEven={index % 2 === 0}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
