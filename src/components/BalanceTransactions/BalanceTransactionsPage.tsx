import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { generateMockTransactions } from "./mockTransactions";

import SummaryCards from "./components/SummaryCards/SummaryCards";
import TransactionFilters from "./components/Filters/TransactionFilters";
import TransactionsTable from "./components/TransactionsTable/TransactionsTable";
import TransactionDetailModal from "./components/TransactionDetailModal";

import { Filters } from "./components/Filters/FilterInputs";
import { Transaction as RowTransaction } from "./components/TransactionsTable/TransactionsTableRow";
import "./BalanceTransactionsPage.css";

const BalanceTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<RowTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<RowTransaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<RowTransaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  const [filters, setFilters] = useState<Filters>({
    dateFrom: "",
    dateTo: "",
    status: "all",
    currency: "all",
    type: "all",
    search: "",
  });

  // Mock API call
  useEffect(() => {
    setTimeout(() => {
      const mockData = generateMockTransactions().map((t) => ({
        ...t,
        id: t.id.toString(),
        amount: typeof t.amount === "string" ? parseFloat(t.amount) : t.amount,
        fee: t.fee ? (typeof t.fee === "string" ? parseFloat(t.fee) : t.fee) : 0,
        balanceImpact: t.balanceImpact?.toString() || "",
      }));
      setTransactions(mockData);
      setFilteredTransactions(mockData);
    }, 500);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...transactions];

    if (filters.dateFrom) filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
    if (filters.dateTo) filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateTo));
    if (filters.status !== "all") filtered = filtered.filter(t => t.status === filters.status);
    if (filters.currency !== "all") filtered = filtered.filter(t => t.currency === filters.currency);
    if (filters.type !== "all") filtered = filtered.filter(t => t.type === filters.type);
    if (filters.search) {
      filtered = filtered.filter(t =>
        t.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.reference?.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.id.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [filters, transactions]);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return (
    <div className="balance-transactions-page">
      {/* Main Content */}
      <div className="main-content">
        <SummaryCards transactions={filteredTransactions} />

        <TransactionFilters
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <TransactionsTable
          transactions={paginatedTransactions}
          totalTransactions={filteredTransactions.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          setSelectedTransaction={setSelectedTransaction}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default BalanceTransactionsPage;
