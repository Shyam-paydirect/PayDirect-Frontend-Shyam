import React from 'react';
import DepositRow from './DepositRow';
import { Deposit } from '../Modal/DepositModal'; // Adjust relative path as needed

interface DepositsTableProps {
  deposits: Deposit[];
  loading: boolean;
  formatAmount: (amount: number, currency: string) => string;
  formatDate: (dateStr: string) => string;
  onSelectDeposit: (deposit: Deposit) => void;
}

const DepositsTable: React.FC<DepositsTableProps> = ({
  deposits,
  loading,
  formatAmount,
  formatDate,
  onSelectDeposit,
}) => {
  if (loading) return <p>Loading deposits...</p>;
  if (!deposits.length) return <p>No deposits found.</p>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Currency</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Payment Method</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((d) => (
            <DepositRow
              key={d.id}
              deposit={d}
              formatDate={formatDate}
              formatAmount={formatAmount}
              onSelectDeposit={onSelectDeposit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepositsTable;
