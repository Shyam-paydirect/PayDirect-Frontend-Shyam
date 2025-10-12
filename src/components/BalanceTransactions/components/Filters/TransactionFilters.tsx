import React from "react";
import { Search, SlidersHorizontal, Download } from "lucide-react";
import FilterInputs, { Filters } from "./FilterInputs";

interface TransactionFiltersProps {
  filters: Filters & { search: string };
  setFilters: React.Dispatch<React.SetStateAction<Filters & { search: string }>>;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
}) => {
  return (
    <div className="filter-section">
      {/* Header with search + toggle */}
      <div className="filter-header">
        <div className="filter-controls">
          {/* Search Input */}
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="search-input"
            />
          </div>

          {/* Button Group */}
          <div className="button-group">
            {/* Export Button */}
            <button className="export-button" title="Download your transactions in .xls format">
              <Download /> Export
            </button>

            {/* Toggle Filters Button */}
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="filter-toggle-button"
            >
              <SlidersHorizontal />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <FilterInputs filters={filters} setFilters={setFilters} />
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
