import { FC, useState } from "react";
import { RefreshCw, ChevronDown } from "lucide-react";

// Define props for DashboardHeader
interface DashboardHeaderProps {
  livemode: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  selectedCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({
  livemode,
  onRefresh,
  isRefreshing,
  selectedCurrency = "All",
  onCurrencyChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const currencies = ["All", "USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD"];
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__container">
        {/* Currency Filter & Title */}
        <div className="dashboard-header__left">
          <div className="currency-filter">
            <div className="currency-filter__dropdown">
              <button
                className="currency-filter__button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="currency-filter__label">Filter by Currency:</span>
                <span className="currency-filter__selected">{selectedCurrency}</span>
                <ChevronDown className={`currency-filter__icon ${isDropdownOpen ? 'currency-filter__icon--open' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="currency-filter__menu">
                  {currencies.map((currency) => (
                    <button
                      key={currency}
                      className={`currency-filter__option ${selectedCurrency === currency ? 'currency-filter__option--selected' : ''}`}
                      onClick={() => {
                        onCurrencyChange?.(currency);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mode Badge + Refresh */}
        <div className="dashboard-header__right">
          {livemode ? (
            <span className="mode-badge mode-badge--live">Live Mode</span>
          ) : (
            <span className="mode-badge mode-badge--test">Test Mode</span>
          )}

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="refresh-button"
          >
            <RefreshCw
              className={`refresh-button__icon ${
                isRefreshing ? "refresh-button__icon--spinning" : ""
              }`}
            />
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
};
