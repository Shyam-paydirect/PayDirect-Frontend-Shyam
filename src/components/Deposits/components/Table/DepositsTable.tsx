import React from 'react';
import DepositRow from './DepositRow';
import { Deposit } from '../Modal/DepositModal'; // Adjust relative path as needed
import './DepositsTable.css';

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
    <div className="table-card">
      <div className="table-scroll-x">
        <table className="w-full text-xs sm:text-sm deposits-table">
        <thead className="deposits-thead">
          <tr>
            <th>Created</th>
            <th>Invoice No.</th>
            <th>Payment Method</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((d) => (
            <tr
              key={d.id}
              className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectDeposit(d)}
            >
              <td className="px-3 sm:px-4 py-3 align-top">
                <div className="leading-tight whitespace-pre-line text-gray-700">
                  {formatDate(d.createdAt)}
                </div>
              </td>
              <td className="px-3 sm:px-4 py-3 align-top">
                <div className="font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-none" title={d.id}>
                  {d.id}
                </div>
              </td>
              <td className="px-3 sm:px-4 py-3 align-top text-gray-700 truncate max-w-[140px] sm:max-w-none">
                {d.paymentMethod}
              </td>
              <td className="px-3 sm:px-4 py-3 align-top font-medium text-gray-900">
                {formatAmount(d.amount, d.currency)}
              </td>
              <td className="px-3 sm:px-4 py-3 align-top">
                <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full uppercase tracking-wide ${
                  d.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : d.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>{d.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepositsTable;
