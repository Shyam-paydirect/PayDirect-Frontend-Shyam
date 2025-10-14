import React, { useMemo, useState } from "react";
import { useBalance } from "./useBalance";
import { getCurrencyFlag } from "./getCurrencyFlag";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import "./BalanceDashboard.css";

const BalancesDashboard: React.FC = () => {
  const { data: balanceData, loading, error, refetch } = useBalance();

  const currencies = useMemo(() => {
    // Display a comprehensive list of supported currencies under "Others"
    const ALL_CURRENCIES: string[] = [
      'USD','EUR','GBP','INR','JPY','AUD','CAD','CHF','CNY','CZK','DKK','NZD','NOK','SEK','SGD','HKD','ZAR','MXN','BRL','TRY','KRW','TWD','THB','PLN','ILS'
    ];
    // Ensure any currencies present in data are included as well
    const dynamic = new Set<string>(ALL_CURRENCIES);
    const add = (items?: { currency: string }[]) => items?.forEach((i) => dynamic.add(i.currency));
    add(balanceData?.available);
    add(balanceData?.pending);
    add(balanceData?.processing);
    add(balanceData?.payout_processing);
    add(balanceData?.fee_advance);
    return Array.from(dynamic);
  }, [balanceData]);

  const defaultCurrency = currencies.includes("USD") ? "USD" : currencies[0] || "USD";
  const [selectedCurrency, setSelectedCurrency] = useState<string>(defaultCurrency);

  const sumByCurrency = (items: { amount: string; currency: string }[] | undefined, currency: string) => {
    return (items || [])
      .filter((i) => i.currency === currency)
      .reduce((sum, i) => sum + parseFloat(i.amount), 0);
  };

  const receivingAccountBalance = useMemo(() => {
    return sumByCurrency(balanceData?.available, selectedCurrency);
  }, [balanceData, selectedCurrency]);

  const processingBalance = useMemo(() => {
    return sumByCurrency(balanceData?.processing, selectedCurrency);
  }, [balanceData, selectedCurrency]);

  if (loading && !balanceData) return <LoadingState />;
  if (error) return <ErrorState onRetry={refetch} />;

  return (
    <div className="balances-dashboard balances-new">
      {/* Top info bar */}
      <div className="balances-topbar">
        <div className="balances-topbar__left">
          <div className="balances-topbar__metric"><span className="label">Balance:</span><span className="value">{selectedCurrency} {receivingAccountBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <div className="divider">|</div>
          <div className="balances-topbar__metric"><span className="label">Active Receivables:</span><span className="value">0</span></div>
        </div>
        <div className="balances-topbar__right"></div>
      </div>

      {/* Main 3-pane layout */}
      <div className="balances-layout">
        {/* Left currency list */}
        <aside className="balances-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">Currency</div>
            <div className="sidebar-count">{currencies.length}</div>
            <button className="sidebar-search" aria-label="search">
              <span className="ri-search-2-line"></span>
            </button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section__title">Preferred Currency</div>
            <button
              className={`currency-item ${selectedCurrency === defaultCurrency ? "active" : ""}`}
              onClick={() => setSelectedCurrency(defaultCurrency)}
            >
              <span className="currency-flag">{getCurrencyFlag(defaultCurrency)}</span>
              <div className="currency-info">
                <div className="currency-amount">{defaultCurrency} {receivingAccountBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="currency-name">{currencyName(defaultCurrency)}</div>
              </div>
            </button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section__title">Others</div>
            <div className="currency-list">
              {currencies
                .filter((c) => c !== defaultCurrency)
                .map((c) => (
                  <button
                    key={c}
                    className={`currency-item ${selectedCurrency === c ? "active" : ""}`}
                    onClick={() => setSelectedCurrency(c)}
                  >
                    <span className="currency-flag">{getCurrencyFlag(c)}</span>
                    <div className="currency-info">
                      <div className="currency-amount">
                        {c} {sumByCurrency(balanceData?.available, c).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="currency-name">{currencyName(c)}</div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </aside>

        {/* Center cards */}
        <main className="balances-center">
          <div className="balance-card">
            <div className="balance-card__header">
              <div className="balance-card__icon"><i className="ri-wallet-line" /></div>
              <div className="balance-card__title">Receiving Account Balance</div>
              <button className="balance-card__menu" aria-label="menu">⋯</button>
            </div>
            <div className="balance-card__divider" />
            <div className="balance-card__amount">{selectedCurrency} {receivingAccountBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>

          <div className="balance-card">
            <div className="balance-card__header">
              <div className="balance-card__icon"><i className="ri-time-line" /></div>
              <div className="balance-card__title">Processing Balance</div>
              <button className="balance-card__menu" aria-label="menu">⋯</button>
            </div>
            <div className="balance-card__divider" />
            <div className="balance-card__amount">{selectedCurrency} {processingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </main>

        {/* Right empty pane (reserved for future graphs) */}
        <section className="balances-right" />
      </div>
    </div>
  );
};

export default BalancesDashboard;

// --- helpers ---
function currencyName(code: string): string {
  const map: Record<string, string> = {
    USD: "United States Dollar",
    EUR: "Euro",
    GBP: "British Pound Sterling",
    INR: "Indian Rupee",
    AUD: "Australian Dollar",
    CAD: "Canadian Dollar",
    CHF: "Swiss Franc",
    CNY: "Yuan Renminbi",
    CZK: "Czech Koruna",
    DKK: "Danish Krone",
    JPY: "Japanese Yen",
  };
  return map[code] || code;
}
