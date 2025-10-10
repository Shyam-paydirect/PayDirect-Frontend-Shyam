import { FC } from "react";
import { getCurrencyFlag } from "../getCurrencyFlag";
import { formatCurrency } from "../formatCurrency";

// Define the shape of balances for a currency
interface CurrencyBalance {
  available: number;
  pending: number;
  processing: number;
  payout_processing: number;
  fee_advance: number;
}

// Define props for the BalanceTableRow component
interface BalanceTableRowProps {
  currency: string;
  balances: CurrencyBalance;
  isEven: boolean; // ✅ added for alternating row styles
}

export const BalanceTableRow: FC<BalanceTableRowProps> = ({
  currency,
  balances,
  isEven,
}) => {
  return (
    <tr className={`balance-table__row ${isEven ? "even" : "odd"}`}>
      {/* Currency */}
      <td>
        <div className="balance-table__currency">
          <span className="balance-table__currency-flag">
            {getCurrencyFlag(currency)}
          </span>
          <span className="balance-table__currency-code">{currency}</span>
        </div>
      </td>

      {/* Available */}
      <td className="text-right">
        <span className="balance-table__amount balance-table__amount--available">
          {formatCurrency(balances.available, currency)}
        </span>
      </td>

      {/* Pending */}
      <td className="text-right">
        <span className="balance-table__amount balance-table__amount--pending">
          {formatCurrency(balances.pending, currency)}
        </span>
      </td>

      {/* Processing */}
      <td className="text-right">
        <span className="balance-table__amount balance-table__amount--processing">
          {formatCurrency(balances.processing, currency)}
        </span>
      </td>

      {/* Payout Processing */}
      <td className="text-right">
        <span className="balance-table__amount balance-table__amount--payout">
          {formatCurrency(balances.payout_processing, currency)}
        </span>
      </td>

      {/* Fee Advance */}
      <td className="text-right">
        <span className="balance-table__amount balance-table__amount--fee">
          {formatCurrency(balances.fee_advance, currency)}
        </span>
      </td>
    </tr>
  );
};
