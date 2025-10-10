import { useState, useEffect } from "react";

// ----- Types -----
export interface BalanceItem {
  amount: string;
  currency: string;
}

export interface BalanceData {
  account_id?: string;
  available?: BalanceItem[];
  pending?: BalanceItem[];
  processing?: BalanceItem[];
  payout_processing?: BalanceItem[];
  fee_advance?: BalanceItem[];
  livemode?: boolean;
  [key: string]: any;
}

// ----- Hook -----
export const useBalance = (accountId?: string) => {
  const [data, setData] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulated API call
      setTimeout(() => {
        setData({
          account_id: accountId || "acc_123",
          available: [
            { amount: "50000.00", currency: "INR" },
            { amount: "500.00", currency: "USD" },
            { amount: "350.00", currency: "EUR" },
          ],
          pending: [
            { amount: "15000.00", currency: "INR" },
            { amount: "300.00", currency: "USD" },
          ],
          processing: [
            { amount: "5000.00", currency: "INR" },
            { amount: "50.00", currency: "USD" },
          ],
          payout_processing: [
            { amount: "10000.00", currency: "INR" },
            { amount: "100.00", currency: "USD" },
          ],
          fee_advance: [],
          livemode: true,
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [accountId]);

  return { data, loading, error, refetch: fetchBalance };
};
