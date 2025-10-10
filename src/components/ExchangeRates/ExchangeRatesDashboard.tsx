import React, { useState } from "react";
import DashboardHeader from "./components/header/Header";
import SummaryCards from "./components/summary/SummaryCards";
import SearchAndFilters from "./components/filters/SearchAndFilters";
import PaginationControls from "./components/pagination/PaginationControls";
import "./ExchangeRatesDashboard.css";

// --------------------
// Types
// --------------------
export type Filters = {
  sortOrder: "none" | "asc" | "desc";
  currency: "all" | "INR" | "USD" | "EUR" | "GBP";
  dateFrom: string;
  dateTo: string;
};

export interface Rate {
  id: number;
  from: string;
  to: string;
  rate: number;
  change24h: number;
  change7d: number;
  change30d: number;
  timestamp: string;
}

// --------------------
// Dummy Data
// --------------------
const dummyRates: Rate[] = [
  { id: 1, from: "USD", to: "EUR", rate: 0.94, change24h: 0.5, change7d: -1.2, change30d: 0.8, timestamp: "2025-10-03" },
  { id: 2, from: "USD", to: "INR", rate: 83.12, change24h: -0.3, change7d: 0.7, change30d: 1.5, timestamp: "2025-10-03" },
  { id: 3, from: "EUR", to: "GBP", rate: 0.87, change24h: 0.2, change7d: -0.5, change30d: 0.9, timestamp: "2025-10-03" },
  { id: 4, from: "USD", to: "JPY", rate: 149.3, change24h: 0.1, change7d: -0.4, change30d: 0.6, timestamp: "2025-10-03" },
  { id: 5, from: "GBP", to: "USD", rate: 1.23, change24h: -0.2, change7d: 0.3, change30d: 0.4, timestamp: "2025-10-03" },
  { id: 6, from: "EUR", to: "INR", rate: 88.2, change24h: 0.4, change7d: -0.7, change30d: 1.2, timestamp: "2025-10-03" },
  { id: 7, from: "AUD", to: "USD", rate: 0.64, change24h: -0.1, change7d: 0.5, change30d: 0.9, timestamp: "2025-10-03" },
  { id: 8, from: "USD", to: "CAD", rate: 1.34, change24h: 0.3, change7d: -0.2, change30d: 0.5, timestamp: "2025-10-03" },
  { id: 9, from: "GBP", to: "EUR", rate: 1.14, change24h: 0.2, change7d: -0.1, change30d: 0.3, timestamp: "2025-10-03" },
  { id: 10, from: "JPY", to: "USD", rate: 0.0067, change24h: -0.05, change7d: 0.1, change30d: 0.2, timestamp: "2025-10-03" },
  { id: 11, from: "INR", to: "USD", rate: 0.012, change24h: 0.03, change7d: -0.05, change30d: 0.1, timestamp: "2025-10-03" },
  { id: 12, from: "CAD", to: "EUR", rate: 0.7, change24h: -0.2, change7d: 0.3, change30d: 0.4, timestamp: "2025-10-03" },
  { id: 13, from: "AUD", to: "INR", rate: 53.1, change24h: 0.5, change7d: -0.8, change30d: 1.0, timestamp: "2025-10-03" },
  { id: 14, from: "EUR", to: "JPY", rate: 159.5, change24h: -0.1, change7d: 0.4, change30d: 0.6, timestamp: "2025-10-03" },
  { id: 15, from: "GBP", to: "INR", rate: 102.7, change24h: 0.2, change7d: -0.3, change30d: 0.5, timestamp: "2025-10-03" },
  { id: 16, from: "USD", to: "GBP", rate: 0.81, change24h: -0.2, change7d: 0.3, change30d: 0.6, timestamp: "2025-10-03" },
  { id: 17, from: "CAD", to: "USD", rate: 0.75, change24h: 0.1, change7d: -0.1, change30d: 0.2, timestamp: "2025-10-03" },
  { id: 18, from: "JPY", to: "EUR", rate: 0.0071, change24h: 0.02, change7d: -0.03, change30d: 0.05, timestamp: "2025-10-03" },
  { id: 19, from: "INR", to: "EUR", rate: 0.0113, change24h: -0.01, change7d: 0.02, change30d: 0.03, timestamp: "2025-10-03" },
  { id: 20, from: "AUD", to: "GBP", rate: 0.49, change24h: 0.1, change7d: -0.2, change30d: 0.3, timestamp: "2025-10-03" },
];

// --------------------
// Component
// --------------------
const ExchangeRateDashboard: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    sortOrder: "none",
    currency: "all",
    dateFrom: "",
    dateTo: "",
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [rates] = useState<Rate[]>(dummyRates);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // --------------------
  // Filter
  // --------------------
  const filteredRates = rates.filter((r) => {
    const matchesCurrency =
      filters.currency === "all" || r.from === filters.currency || r.to === filters.currency;
    const matchesDateFrom = filters.dateFrom ? new Date(r.timestamp) >= new Date(filters.dateFrom) : true;
    const matchesDateTo = filters.dateTo ? new Date(r.timestamp) <= new Date(filters.dateTo) : true;
    const matchesSearch =
      !searchTerm ||
      r.from.includes(searchTerm.toUpperCase()) ||
      r.to.includes(searchTerm.toUpperCase());

    return matchesCurrency && matchesDateFrom && matchesDateTo && matchesSearch;
  });

  // --------------------
  // Sort
  // --------------------
  const sortedRates = [...filteredRates];
  if (filters.sortOrder === "asc") sortedRates.sort((a, b) => a.change24h - b.change24h);
  if (filters.sortOrder === "desc") sortedRates.sort((a, b) => b.change24h - a.change24h);

  // --------------------
  // Pagination
  // --------------------
  const totalPages = Math.ceil(sortedRates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedRates.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="exchange-dashboard p-6">
      <DashboardHeader />
      <SummaryCards stats={{ conversion: "0.94", increase: "+0.5%" }} />

      {/* Search & Filters */}
      <div className="my-6 border rounded p-4">
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </div>

      {/* Rates Table */}
      <div className="rates-table mt-6 border rounded overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">From</th>
              <th className="px-4 py-2 text-left">To</th>
              <th className="px-4 py-2 text-left">Rate</th>
              <th className="px-4 py-2 text-left">24h %</th>
              <th className="px-4 py-2 text-left">7d %</th>
              <th className="px-4 py-2 text-left">30d %</th>
              <th className="px-4 py-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((rate) => (
                <tr key={rate.id}>
                  <td className="px-4 py-2">{rate.from}</td>
                  <td className="px-4 py-2">{rate.to}</td>
                  <td className="px-4 py-2">{rate.rate}</td>
                  <td className={`px-4 py-2 ${rate.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {rate.change24h}%
                  </td>
                  <td className={`px-4 py-2 ${rate.change7d >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {rate.change7d}%
                  </td>
                  <td className={`px-4 py-2 ${rate.change30d >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {rate.change30d}%
                  </td>
                  <td className="px-4 py-2">{rate.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No exchange rates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalItems={sortedRates.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ExchangeRateDashboard;
