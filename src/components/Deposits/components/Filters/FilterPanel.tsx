import React from 'react';

// Define the shape of the filters
export interface Filters {
  status: 'all' | 'completed' | 'pending' | 'failed';
  currency: 'all' | 'INR' | 'USD';
  dateFrom: string;
  dateTo: string;
}

// Define the props for the component
interface FilterPanelProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters }) => {
  return (
    <>
      <div className="filter-group">
        <label>Status:</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value as Filters['status'] })}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Currency:</label>
        <select
          value={filters.currency}
          onChange={(e) => setFilters({ ...filters, currency: e.target.value as Filters['currency'] })}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Date Range:</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          className="filter-input"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          className="filter-input"
        />
      </div>
    </>
  );
};

export default FilterPanel;
