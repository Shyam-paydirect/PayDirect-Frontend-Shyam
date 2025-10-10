import React, { useState, useMemo } from "react";
import DashboardHeader from "./components/header/Header";
import SummaryCards from "./components/summary/SummaryCards";
import SearchAndFilters from "./components/filters/SearchAndFilters";
import PaginationControls from "./components/pagination/PaginationControls";
import type { Filters } from "./components/filters/FilterPanel";
import "./PayoutsDashboard.css";

type Payout = {
  id: number;
  currency: "USD" | "EUR" | "INR" | "GBP";
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  date: string;
  paymentMethod: string;
  descriptor: string;
};

const dummyPayouts: Payout[] = [
  { id: 1, currency: "USD", amount: 1200, status: "Completed", date: "2025-09-20", paymentMethod: "Bank Transfer", descriptor: "Salary" },
  { id: 2, currency: "EUR", amount: 800, status: "Pending", date: "2025-09-25", paymentMethod: "PayPal", descriptor: "Invoice #123" },
  { id: 3, currency: "INR", amount: 60000, status: "Completed", date: "2025-10-01", paymentMethod: "Bank Transfer", descriptor: "Freelance" },
  { id: 4, currency: "GBP", amount: 400, status: "Failed", date: "2025-10-02", paymentMethod: "Stripe", descriptor: "Refund" },
  { id: 5, currency: "USD", amount: 500, status: "Completed", date: "2025-09-28", paymentMethod: "Bank Transfer", descriptor: "Bonus" },
  { id: 6, currency: "EUR", amount: 950, status: "Completed", date: "2025-10-03", paymentMethod: "PayPal", descriptor: "Invoice #124" },
  { id: 7, currency: "INR", amount: 15000, status: "Pending", date: "2025-10-04", paymentMethod: "Bank Transfer", descriptor: "Project Payment" },
  { id: 8, currency: "USD", amount: 700, status: "Failed", date: "2025-10-05", paymentMethod: "Stripe", descriptor: "Refund" },
  { id: 9, currency: "GBP", amount: 1200, status: "Completed", date: "2025-09-30", paymentMethod: "Bank Transfer", descriptor: "Consulting" },
  { id: 10, currency: "EUR", amount: 600, status: "Pending", date: "2025-10-06", paymentMethod: "PayPal", descriptor: "Invoice #125" },
  { id: 11, currency: "INR", amount: 45000, status: "Completed", date: "2025-10-07", paymentMethod: "Bank Transfer", descriptor: "Freelance" },
  { id: 12, currency: "USD", amount: 300, status: "Pending", date: "2025-10-08", paymentMethod: "Stripe", descriptor: "Refund" },
];

type StatusCounts = {
  Completed: number;
  Pending: number;
  Failed: number;
};

const PayoutsDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    sortOrder: "none",
    currency: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const filteredData = useMemo(() => {
    return dummyPayouts
      .filter((p) =>
        searchTerm
          ? p.id.toString().includes(searchTerm) ||
            p.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.descriptor.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .filter((p) => (filters.currency !== "all" ? p.currency === filters.currency : true))
      .filter((p) => (filters.dateFrom ? p.date >= filters.dateFrom : true))
      .filter((p) => (filters.dateTo ? p.date <= filters.dateTo : true))
      .sort((a, b) => {
        if (filters.sortOrder === "asc") return a.amount - b.amount;
        if (filters.sortOrder === "desc") return b.amount - a.amount;
        return 0;
      });
  }, [searchTerm, filters]);

  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const totalPayouts = filteredData.length;
  const totalAmount = filteredData.reduce((sum, p) => sum + p.amount, 0);
  const statusCounts: StatusCounts = filteredData.reduce(
    (acc: StatusCounts, p) => {
      acc[p.status] += 1;
      return acc;
    },
    { Completed: 0, Pending: 0, Failed: 0 }
  );

  return (
    <div className="payouts-dashboard">
      <DashboardHeader />

      <SummaryCards
        stats={{
          totalPayouts,
          totalAmount,
          ...statusCounts,
        }}
      />

      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      <div className="payouts-table border rounded mt-4 p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Payout ID</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Currency</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Payment Method</th>
              <th className="border p-2">Statement Descriptor</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((p) => (
                <tr key={p.id}>
                  <td className="border p-2">{p.id}</td>
                  <td className="border p-2">{p.amount}</td>
                  <td className="border p-2">{p.currency}</td>
                  <td
                    className={`border p-2 font-semibold ${
                      p.status === "Completed"
                        ? "text-green-600"
                        : p.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {p.status}
                  </td>
                  <td className="border p-2">{p.date}</td>
                  <td className="border p-2">{p.paymentMethod}</td>
                  <td className="border p-2">{p.descriptor}</td>
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

export default PayoutsDashboard;
