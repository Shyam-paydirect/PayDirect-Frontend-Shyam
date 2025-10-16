import { useState, useEffect } from "react";
import axios from "axios";

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
      // Determine base URL and account id
      const baseURL = (process as any)?.env?.NEXT_PUBLIC_API_BASE_URL || 'http://43.205.26.213:7015';
      let acct = accountId || '';
      if (!acct) {
        try {
          if (typeof window !== 'undefined') {
            acct = localStorage.getItem('xflow-account') || '';
          }
        } catch (_) {}
      }
      if (!acct) {
        const envAcct = (process as any)?.env?.NEXT_PUBLIC_XFLOW_ACCOUNT;
        acct = envAcct || 'account_F0A_1759166669125_GuHWS_000';
      }

      const res = await axios.get(`${baseURL}/balance`, {
        headers: {
          'Xflow-Account': acct,
          'Content-Type': 'application/json',
        },
        params: {
          account_id: acct,
        },
        timeout: 30000,
      });

      const payload = res.data as any;
      // Normalise minimal shape to BalanceData
      const normalised: BalanceData = {
        account_id: payload?.account_id || acct,
        available: Array.isArray(payload?.available) ? payload.available : [],
        pending: Array.isArray(payload?.pending) ? payload.pending : [],
        processing: Array.isArray(payload?.processing) ? payload.processing : [],
        payout_processing: Array.isArray(payload?.payout_processing) ? payload.payout_processing : [],
        fee_advance: Array.isArray(payload?.fee_advance) ? payload.fee_advance : [],
        livemode: typeof payload?.livemode === 'boolean' ? payload.livemode : true,
        ...payload,
      };

      setData(normalised);
      setLoading(false);
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
