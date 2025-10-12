import { FC } from "react";
import { Wallet, Clock, RotateCcw, ArrowUpRight, CreditCard } from "lucide-react";
import { SummaryCard } from "./SummaryCard";

// Define the shape of individual balance items
interface BalanceItem {
  currency: string;
  amount: number | string;
}

// Define the shape of balance data categories
interface BalanceData {
  available?: BalanceItem[];
  pending?: BalanceItem[];
  processing?: BalanceItem[];
  payout_processing?: BalanceItem[];
  fee_advance?: BalanceItem[];
  [key: string]: BalanceItem[] | undefined;
}

// Define the category structure used in the summary cards
interface Category {
  key: keyof BalanceData;
  label: string;
  color: string;
  icon: React.FC<{ className?: string }>;
}

interface SummaryCardsGridProps {
  balanceData: BalanceData;
}

export const SummaryCardsGrid: FC<SummaryCardsGridProps> = ({ balanceData }) => {
  const categories: Category[] = [
    { key: "available", label: "Available", color: "bg-green-500", icon: Wallet },
    { key: "pending", label: "Pending", color: "bg-orange-500", icon: Clock },
    { key: "processing", label: "Processing", color: "bg-blue-500", icon: RotateCcw },
    { key: "payout_processing", label: "Payout Processing", color: "bg-gray-500", icon: ArrowUpRight },
    { key: "fee_advance", label: "Fee Advance", color: "bg-purple-500", icon: CreditCard },
  ];

  const summaryCards = categories.map((cat) => {
    const total =
      balanceData[cat.key]?.reduce(
        (sum, item) => sum + parseFloat(item.amount as string),
        0
      ) || 0;

    const primaryCurrency = balanceData[cat.key]?.[0]?.currency || "INR";

    return { ...cat, total, currency: primaryCurrency };
  });

  return (
    <div className="summary-cards-grid">
      {summaryCards.map((card) => (
        <SummaryCard
          key={card.key}
          category={card.label}
          total={card.total}
          currency={card.currency}
          color={card.color}
          icon={card.icon}
        />
      ))}
    </div>
  );
};
