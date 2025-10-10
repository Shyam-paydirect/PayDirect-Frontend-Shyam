import React from 'react';

interface Filters {
  sortOrder: 'none' | 'asc' | 'desc';
  currency: 'all' | 'USD' | 'EUR' | 'INR' | 'GBP';
  dateFrom: string;
  dateTo: string;
}

interface FilterPanelProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters }) => {
  return (
    <div className="filter-panel flex gap-4 flex-wrap">
      {/* Sort by Rate */}
      <div className="filter-group">
        <label>Sort By Rate:</label>
        <select
          value={filters.sortOrder}
          onChange={(e) =>
            setFilters({ ...filters, sortOrder: e.target.value as Filters['sortOrder'] })
          }
          className="filter-select border p-2 rounded"
        >
          <option value="none">None</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Currency Filter */}
      <div className="filter-group">
        <label>Currency Pair:</label>
        <select
          value={filters.currency}
          onChange={(e) =>
            setFilters({ ...filters, currency: e.target.value as Filters['currency'] })
          }
          className="filter-select border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="INR">INR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="filter-group">
        <label>Date From:</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          className="filter-input border p-2 rounded"
        />
        <label>Date To:</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          className="filter-input border p-2 rounded"
        />
      </div>
    </div>
  );
};

export default FilterPanel;
