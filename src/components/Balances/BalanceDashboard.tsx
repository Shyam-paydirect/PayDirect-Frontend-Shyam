import React, { useState } from "react";
import { useBalance } from "./useBalance";
import { useAggregateBalance, AggregateData } from "./useAggregateBalance";
import { DashboardHeader } from "./components/DashboardHeader";
import { SummaryCardsGrid } from "./components/SummaryCardsGrid";
import { AggregateBalanceWidget } from "./components/AggregateBalanceWidget";
import { BalanceTable } from "./components/BalanceTable";
import { DashboardFooter } from "./components/DashboardFooter";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import "./BalanceDashboard.css";

const BalancesDashboard: React.FC = () => {
  const [isAdmin] = useState(true);

  const { data: balanceData, loading: balanceLoading, error: balanceError, refetch } = useBalance();

  // ✅ Pass account_id as argument
  const { data: aggregateData } = useAggregateBalance(balanceData?.account_id || "acc_123");

  if (balanceLoading && !balanceData) return <LoadingState />;
  if (balanceError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e9f0fb] to-[#f9fbff]">
      <DashboardHeader
        livemode={balanceData?.livemode ?? false}
        onRefresh={refetch}
        isRefreshing={balanceLoading}
      />

      <div className="max-w-7xl mx-auto p-6">
        <SummaryCardsGrid balanceData={balanceData || {}} />
        {isAdmin && aggregateData && <AggregateBalanceWidget aggregateData={aggregateData} />}
        <BalanceTable balanceData={balanceData || {}} />
        <DashboardFooter />
      </div>
    </div>
  );
};

export default BalancesDashboard;
