import { useState, useEffect } from "react";

export interface PendingItem {
  amount: number; // must be number
  currency: string;
}

export interface AggregateData {
  pending: PendingItem[];
  livemode?: boolean;
}

export const useAggregateBalance = (accountId: string) => {
  const [data, setData] = useState<AggregateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData({
        pending: [
          { amount: 125000, currency: "INR" },
          { amount: 2500, currency: "USD" },
          { amount: 1800, currency: "EUR" },
        ],
        livemode: true,
      });
      setLoading(false);
    }, 1200);
  }, [accountId]);

  return { data, loading, error };
};
