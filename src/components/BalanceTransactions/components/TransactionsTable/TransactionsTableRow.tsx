import React from "react";
import { Eye } from "lucide-react";
import { formatDate, formatAmount } from "../../transactionHelpers";

// Component-specific Transaction type
export interface Transaction {
  id: string;
  date: string;
  type: "payment" | "payout" | "refund" | "fee" | "adjustment" | string;
  amount: number;
  currency: string;
  status: "available" | "pending" | "failed" | string;
  reference?: string;
  fee?: number;
  balanceImpact?: string;
  description?: string;
}

interface Props {
  transaction: Transaction;
  setSelectedTransaction: (t: Transaction) => void;
}

const TransactionsTableRow: React.FC<Props> = ({ transaction, setSelectedTransaction }) => {
  return (
    <tr>
      <td>{formatDate(transaction.date)}</td>
      <td>{transaction.type}</td>
      <td className="text-right">{formatAmount(transaction.amount, transaction.currency)}</td>
      <td>{transaction.currency}</td>
      <td>{transaction.status}</td>
      <td>{transaction.description}</td>
      <td>{transaction.reference}</td>
      <td className="text-right">{transaction.fee ? formatAmount(transaction.fee, transaction.currency) : 0}</td>
      <td className="text-right">{transaction.balanceImpact || ""}</td>
      <td>
        <button onClick={() => setSelectedTransaction(transaction)}>
          <Eye />
        </button>
      </td>
    </tr>
  );
};

export default TransactionsTableRow;
