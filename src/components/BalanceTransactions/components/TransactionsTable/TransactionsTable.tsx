import React from "react";
import TransactionsTableRow, { Transaction } from "./TransactionsTableRow";
import Pagination from "./Pagination";

interface TransactionsTableProps {
  transactions: Transaction[];
  totalTransactions: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
  itemsPerPage: number;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  totalTransactions,
  currentPage,
  setCurrentPage,
  totalPages,
  setSelectedTransaction,
  itemsPerPage,
}) => {
  return (
    <div className="transactions-table-container">
      {/* Table */}
      <div className="table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th className="text-right">Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Description</th>
              <th>Reference</th>
              <th className="text-right">Fee</th>
              <th className="text-right">Balance Impact</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TransactionsTableRow
                  key={transaction.id}
                  transaction={transaction}
                  setSelectedTransaction={setSelectedTransaction}
                />
              ))
            ) : (
              <tr>
                <td colSpan={10} className="empty-state">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with pagination */}
      <div className="pagination">
        <p className="pagination-info">
          Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
          <span>{Math.min(currentPage * itemsPerPage, totalTransactions)}</span> of{" "}
          <span>{totalTransactions}</span> transactions
        </p>
        <div className="pagination-controls">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
