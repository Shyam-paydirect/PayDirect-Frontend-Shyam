// Format date to "DD MMM YYYY, HH:MM" in en-IN locale
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format amount as currency in en-IN locale
export const formatAmount = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
