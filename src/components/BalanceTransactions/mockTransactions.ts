export type Transaction = {
  id: string;
  date: string;
  type: "payment" | "payout" | "refund" | "fee" | "adjustment";
  amount: string; // keeping as string because of .toFixed(2)
  currency: "USD" | "INR" | "EUR" | "GBP";
  status: "available" | "pending" | "failed";
  description: string;
  reference: string;
  balanceImpact: "available" | "pending";
  fee: string; // keeping as string because of .toFixed(2)
};

export const generateMockTransactions = (): Transaction[] => {
  const types: Transaction["type"][] = ["payment", "payout", "refund", "fee", "adjustment"];
  const statuses: Transaction["status"][] = ["available", "pending", "failed"];
  const currencies: Transaction["currency"][] = ["USD", "INR", "EUR", "GBP"];

  return Array.from({ length: 50 }, (_, i) => ({
    id: `bt_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    type: types[Math.floor(Math.random() * types.length)],
    amount: (Math.random() * 10000 - 2000).toFixed(2),
    currency: currencies[Math.floor(Math.random() * currencies.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    description: `Transaction for order #${1000 + i}`,
    reference: `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    balanceImpact: Math.random() > 0.5 ? "available" : "pending",
    fee: (Math.random() * 50).toFixed(2),
  }));
};
