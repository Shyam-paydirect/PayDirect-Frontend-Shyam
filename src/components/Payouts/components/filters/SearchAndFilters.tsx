import React from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import type { Filters } from './FilterPanel';

type SearchAndFiltersProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
}) => {
  return (
    <div className="filters-section">
      <div className="filters-top">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="filter-btn"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="filters-expanded">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
