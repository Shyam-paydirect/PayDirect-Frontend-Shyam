import React, { useState, useMemo } from "react";
import DashboardHeader from "./components/header/Header";
import SummaryCards from "./components/summary/SummaryCards";
import SearchAndFilters from "./components/filters/SearchAndFilters";
import PaginationControls from "./components/pagination/PaginationControls";
import { Filters } from "./components/filters/FilterPanel";
import "./RecievablesDashboard.css";

// ---------------------- Types ----------------------
export type Receivable = {
  id: number;
  amount: number;
  currency: "USD" | "EUR" | "INR" | "GBP";
  status: "Confirmed" | "Pending" | "Cancelled";
  createdAt: string;
  invoiceId: string;
  dueDate: string;
};

type StatusCounts = {
  Confirmed: number;
  Pending: number;
  Cancelled: number;
};

// ---------------------- Dummy Data ----------------------
const dummyReceivables: Receivable[] = [
  { id: 1, amount: 1500, currency: "USD", status: "Confirmed", createdAt: "2025-09-20", invoiceId: "INV-001", dueDate: "2025-10-05" },
  { id: 2, amount: 1200, currency: "EUR", status: "Pending", createdAt: "2025-09-25", invoiceId: "INV-002", dueDate: "2025-10-10" },
  { id: 3, amount: 85000, currency: "INR", status: "Confirmed", createdAt: "2025-10-01", invoiceId: "INV-003", dueDate: "2025-10-15" },
  { id: 4, amount: 700, currency: "GBP", status: "Cancelled", createdAt: "2025-10-02", invoiceId: "INV-004", dueDate: "2025-10-18" },
  { id: 5, amount: 900, currency: "USD", status: "Confirmed", createdAt: "2025-09-28", invoiceId: "INV-005", dueDate: "2025-10-12" },
  { id: 6, amount: 1350, currency: "EUR", status: "Confirmed", createdAt: "2025-10-03", invoiceId: "INV-006", dueDate: "2025-10-16" },
  { id: 7, amount: 30000, currency: "INR", status: "Pending", createdAt: "2025-10-04", invoiceId: "INV-007", dueDate: "2025-10-20" },
  { id: 8, amount: 450, currency: "USD", status: "Cancelled", createdAt: "2025-10-05", invoiceId: "INV-008", dueDate: "2025-10-22" },
  { id: 9, amount: 1400, currency: "GBP", status: "Confirmed", createdAt: "2025-09-30", invoiceId: "INV-009", dueDate: "2025-10-17" },
  { id: 10, amount: 1100, currency: "EUR", status: "Pending", createdAt: "2025-10-06", invoiceId: "INV-010", dueDate: "2025-10-23" },
  { id: 11, amount: 42000, currency: "INR", status: "Confirmed", createdAt: "2025-10-07", invoiceId: "INV-011", dueDate: "2025-10-25" },
  { id: 12, amount: 600, currency: "USD", status: "Pending", createdAt: "2025-10-08", invoiceId: "INV-012", dueDate: "2025-10-26" },
];

// ---------------------- Component ----------------------
const ReceivablesDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    sortOrder: "none",
    status: "all", // ✅ Added status
    currency: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;

  // 🔍 Filtering + Searching
  const filteredData = useMemo(() => {
    return dummyReceivables
      .filter((r) =>
        searchTerm
          ? r.id.toString().includes(searchTerm) ||
            r.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.currency.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .filter((r) => (filters.status !== "all" ? r.status === filters.status : true))
      .filter((r) => (filters.currency !== "all" ? r.currency === filters.currency : true))
      .filter((r) => (filters.dateFrom ? r.createdAt >= filters.dateFrom : true))
      .filter((r) => (filters.dateTo ? r.createdAt <= filters.dateTo : true))
      .sort((a, b) => {
        if (filters.sortOrder === "asc") return a.amount - b.amount;
        if (filters.sortOrder === "desc") return b.amount - a.amount;
        return 0;
      });
  }, [searchTerm, filters]);

  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // 📊 Summary Stats
  const totalReceivables = filteredData.length;
  const totalAmount = filteredData.reduce((sum, r) => sum + r.amount, 0);
  const statusCounts: StatusCounts = filteredData.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    { Confirmed: 0, Pending: 0, Cancelled: 0 }
  );

  return (
    <div className="receivables-dashboard">
      <DashboardHeader />

      {/* Summary Section */}
      <SummaryCards
        stats={{
          totalReceivables,
          totalAmount,
          ...statusCounts,
        }}
      />

      {/* Search + Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Receivables Table */}
      <div className="receivables-table border rounded mt-4 p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Receivable ID</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Currency</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Invoice ID</th>
              <th className="border p-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((r) => (
                <tr key={r.id}>
                  <td className="border p-2">{r.id}</td>
                  <td className="border p-2">{r.amount}</td>
                  <td className="border p-2">{r.currency}</td>
                  <td
                    className={`border p-2 font-semibold ${
                      r.status === "Confirmed"
                        ? "text-green-600"
                        : r.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {r.status}
                  </td>
                  <td className="border p-2">{r.createdAt}</td>
                  <td className="border p-2">{r.invoiceId}</td>
                  <td className="border p-2">{r.dueDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / itemsPerPage)}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalItems={filteredData.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ReceivablesDashboard;
