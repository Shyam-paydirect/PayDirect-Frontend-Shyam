import React from 'react';
import StatusBadge from './StatusBadge';
// Correct import using exact casing
import { Deposit } from '../Modal/DepositModal';


interface DepositRowProps {
  deposit: Deposit;
  formatDate: (dateStr: string) => string;
  formatAmount: (amount: number, currency: string) => string;
  onSelectDeposit: (deposit: Deposit) => void;
}

const DepositRow: React.FC<DepositRowProps> = ({
  deposit,
  formatDate,
  formatAmount,
  onSelectDeposit,
}) => {
  return (
    <tr
      className="hover:bg-gray-50 cursor-pointer"
      onClick={() => onSelectDeposit(deposit)}
    >
      <td className="px-4 py-2 font-medium text-gray-900">{formatDate(deposit.createdAt)}</td>
      <td className="px-4 py-2 font-semibold text-gray-900">{deposit.id}</td>
      <td className="px-4 py-2 font-medium text-gray-900">{deposit.paymentMethod}</td>
      <td className="px-4 py-2 font-semibold text-gray-900">{formatAmount(deposit.amount, deposit.currency)}</td>
      <td className="px-4 py-2">
        <StatusBadge status={deposit.status} />
      </td>
    </tr>
  );
};

export default DepositRow;
