import React from "react";
import "../../BalanceTransactionsPage.css";

export interface Filters {
  dateFrom: string;
  dateTo: string;
  status: "all" | "available" | "pending" | "failed";
  currency: "all" | "USD" | "INR" | "EUR" | "GBP";
  type: "all" | "payment" | "payout" | "refund" | "fee" | "adjustment";
  search: string; // required
}

interface FilterInputsProps<T extends Filters> {
  filters: T;
  setFilters: React.Dispatch<React.SetStateAction<T>>;
}

const FilterInputs = <T extends Filters>({ filters, setFilters }: FilterInputsProps<T>) => {
  return (
    <div className="filter-grid">
      {/* Date From */}
      <div className="filter-field">
        <label>Date From</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
        />
      </div>

      {/* Date To */}
      <div className="filter-field">
        <label>Date To</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
        />
      </div>

      {/* Status */}
      <div className="filter-field">
        <label>Status</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as Filters["status"] }))}
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Currency */}
      <div className="filter-field">
        <label>Currency</label>
        <select
          value={filters.currency}
          onChange={(e) => setFilters(prev => ({ ...prev, currency: e.target.value as Filters["currency"] }))}
        >
          <option value="all">All</option>
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      {/* Type */}
      <div className="filter-field">
        <label>Type</label>
        <select
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as Filters["type"] }))}
        >
          <option value="all">All</option>
          <option value="payment">Payment</option>
          <option value="payout">Payout</option>
          <option value="refund">Refund</option>
          <option value="fee">Fee</option>
          <option value="adjustment">Adjustment</option>
        </select>
      </div>

    </div>
  );
};

export default FilterInputs;
