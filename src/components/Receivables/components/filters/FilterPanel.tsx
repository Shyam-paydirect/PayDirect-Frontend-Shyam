import React from "react";

export type Filters = {
  sortOrder: "none" | "asc" | "desc";
  status: "all" | "Confirmed" | "Pending" | "Cancelled";
  currency: "all" | "USD" | "EUR" | "INR" | "GBP";
  dateFrom: string;
  dateTo: string;
};

type FilterPanelProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters }) => {
  return (
    <div className="filter-panel flex gap-4 flex-wrap">
      {/* Sort by Amount */}
      <div className="filter-group">
        <label>Sort by Amount:</label>
        <select
          value={filters.sortOrder}
          onChange={(e) =>
            setFilters({ ...filters, sortOrder: e.target.value as Filters["sortOrder"] })
          }
          className="filter-select border p-2 rounded"
        >
          <option value="none">None</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="filter-group">
        <label>Status:</label>
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value as Filters["status"] })
          }
          className="filter-select border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Currency Filter */}
      <div className="filter-group">
        <label>Currency:</label>
        <select
          value={filters.currency}
          onChange={(e) =>
            setFilters({ ...filters, currency: e.target.value as Filters["currency"] })
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
