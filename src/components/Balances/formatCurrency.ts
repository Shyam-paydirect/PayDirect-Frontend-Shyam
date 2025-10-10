export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
