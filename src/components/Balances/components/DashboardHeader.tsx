import { FC } from "react";
import { RefreshCw } from "lucide-react";

// Define props for DashboardHeader
interface DashboardHeaderProps {
  livemode: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({
  livemode,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__container">
        {/* Logo & Title */}
        <div className="dashboard-header__left">
          <div className="dashboard-header__logo">
            <div className="dashboard-header__logo-icon">
              <span className="dashboard-header__logo-text">P</span>
            </div>
            <span className="dashboard-header__brand">PayDirect</span>
          </div>
          <h1 className="dashboard-header__title">Balances</h1>
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
