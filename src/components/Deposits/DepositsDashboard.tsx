import React, { useState, useEffect } from 'react';
import receivablesService from '@/services/receivables.service';
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
    try {
      const apiDeposits = await receivablesService.fetchDeposits();
      const mapped: Deposit[] = (apiDeposits || []).map((d: any) => {
        const createdIso = d.created_at
          || d.createdAt
          || (typeof d.created === 'number' ? new Date(d.created * 1000).toISOString() : new Date().toISOString());
        const metaObj = d.metadata && typeof d.metadata === 'object' ? d.metadata : {};
        return {
          id: d.id || d.deposit_id || 'dep_' + Math.random().toString(36).slice(2),
          amount: Number(d.amount || 0),
          currency: d.currency || 'USD',
          status: (d.status || 'pending').toLowerCase(),
          createdAt: createdIso,
          paymentMethod: d.payment_method || d.method || 'Bank Transfer',
          metadata: Object.entries(metaObj).map(([key, value]) => ({ key, value: String(value) })) as any,
        };
      });
      setDeposits(mapped);
      setFilteredDeposits(mapped);
    } catch (e: any) {
      console.error('Failed to fetch deposits', e?.response?.data || e?.message);
    } finally {
      setLoading(false);
    }
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

        <div className="table-card" style={{ padding: 16 }}>
          {/* Section Heading */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontWeight: 700, color: '#2d3748' }}>Deposits</h2>
          </div>
          <div style={{ height: 1, background: '#e2e8f0', marginBottom: 12 }} />
          <DepositsTable
            deposits={paginatedDeposits}
            loading={loading}
            formatAmount={formatAmount}
            formatDate={formatDate}
            onSelectDeposit={setSelectedDeposit}
          />
        </div>

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
