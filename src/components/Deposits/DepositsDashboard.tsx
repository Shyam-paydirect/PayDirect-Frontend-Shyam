import React, { useState, useEffect } from 'react';
import DashboardHeader from './components/Header/DashboardHeader';
import SummaryCards from './components/Summary/SummaryCards';
import SearchAndFilters from './components/Filters/SearchAndFilters';
import DepositsTable from './components/Table/DepositsTable';
import PaginationControls from './components/Pagination/PaginationControls';
import DepositModal, { Deposit } from './components/Modal/DepositModal';
import { DepositMetadata } from './components/Modal/MetadataList';
import { formatDate, formatAmount } from './formatters';
import './DepositsDashboard.css';

interface Filters {
  status: 'all' | 'completed' | 'pending' | 'failed';
  currency: 'all' | 'INR' | 'USD';
  dateFrom: string;
  dateTo: string;
}

const DepositsDashboard: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [filteredDeposits, setFilteredDeposits] = useState<Deposit[]>([]);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    currency: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockDeposits: Deposit[] = [
        {
          id: "dep_0001",
          amount: 31930,
          currency: "INR",
          status: "pending",
          createdAt: "2025-09-29T14:00:00Z",
          paymentMethod: "Net Banking",
          metadata: [{ key: "orderId", value: "ORD-87953" }]
        },
        {
          id: "dep_0002",
          amount: 110833,
          currency: "INR",
          status: "completed",
          createdAt: "2025-09-30T01:00:00Z",
          paymentMethod: "International Wire",
          metadata: [{ key: "refundId", value: "REF-1461" }]
        }
      ];

      setDeposits(mockDeposits);
      setFilteredDeposits(mockDeposits);
      setLoading(false);
    }, 500);
  };

  const stats = {
    totalDeposits: filteredDeposits.length,
    totalAmount: filteredDeposits.reduce((sum, d) => sum + d.amount, 0),
    completed: filteredDeposits.filter(d => d.status === 'completed').length,
    pending: filteredDeposits.filter(d => d.status === 'pending').length,
    failed: filteredDeposits.filter(d => d.status === 'failed').length
  };

  // Filter + Search
  useEffect(() => {
    let filtered = [...deposits];
    if (searchTerm) filtered = filtered.filter(d => d.id.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filters.status !== 'all') filtered = filtered.filter(d => d.status === filters.status);
    if (filters.currency !== 'all') filtered = filtered.filter(d => d.currency === filters.currency);
    if (filters.dateFrom) filtered = filtered.filter(d => new Date(d.createdAt) >= new Date(filters.dateFrom));
    if (filters.dateTo) filtered = filtered.filter(d => new Date(d.createdAt) <= new Date(filters.dateTo));
    setFilteredDeposits(filtered);
    setCurrentPage(1);
  }, [searchTerm, filters, deposits]);

  // Pagination
  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeposits = filteredDeposits.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="dashboard-container">
      <DashboardHeader />

      <div className="dashboard-content">
        <SummaryCards stats={stats} formatAmount={formatAmount} />

        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <DepositsTable
          deposits={paginatedDeposits}
          loading={loading}
          formatAmount={formatAmount}
          formatDate={formatDate}
          onSelectDeposit={setSelectedDeposit}
        />

        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            itemsPerPage={itemsPerPage}
            totalItems={filteredDeposits.length}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <DepositModal
        deposit={selectedDeposit}
        onClose={() => setSelectedDeposit(null)}
        formatDate={formatDate}
        formatAmount={formatAmount}
      />
    </div>
  );
};

export default DepositsDashboard;
