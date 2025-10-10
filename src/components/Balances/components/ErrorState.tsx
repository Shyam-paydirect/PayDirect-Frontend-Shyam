import { FC } from "react";

// Props for ErrorState
interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState: FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="error-state">
      <div className="error-state__icon">⚠️</div>
      <h2 className="error-state__title">Error Loading Balances</h2>
      <p className="error-state__description">
        Unable to fetch balance data. Please try again.
      </p>
      <button onClick={onRetry} className="error-state__button">
        Retry
      </button>
    </div>
  );
};
