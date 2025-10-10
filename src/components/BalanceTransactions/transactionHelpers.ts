import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { LucideIcon } from "lucide-react"; // type for icons

export type Status = "available" | "pending" | "failed";
export type TransactionType = "payment" | "payout" | "refund" | "fee" | "adjustment";
export type Currency = "INR" | "USD" | "EUR" | "GBP";

/**
 * Format a date string into human-readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format amount with currency symbol
 */
export const formatAmount = (amount: string | number, currency: Currency): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const symbol =
    currency === "INR"
      ? "₹"
      : currency === "USD"
      ? "$"
      : currency === "EUR"
      ? "€"
      : "£";
  return `${symbol}${Math.abs(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Status badge color classes
 */
export const getStatusColor = (status: Status): string => {
  switch (status) {
    case "available":
      return "text-green-600 bg-green-50";
    case "pending":
      return "text-yellow-600 bg-yellow-50";
    case "failed":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

/**
 * Status icons
 */
export const getStatusIcon = (status: Status): LucideIcon | null => {
  switch (status) {
    case "available":
      return CheckCircle;
    case "pending":
      return Clock;
    case "failed":
      return AlertCircle;
    default:
      return null;
  }
};

/**
 * Transaction type color classes
 */
export const getTypeColor = (type: TransactionType): string => {
  switch (type) {
    case "payment":
      return "text-green-600";
    case "payout":
      return "text-blue-600";
    case "refund":
      return "text-orange-600";
    case "fee":
      return "text-red-600";
    case "adjustment":
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
};
