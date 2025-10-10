import { FC } from "react";

export const EmptyBalanceState: FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">💰</div>
      <h3 className="empty-state__title">No Balances Found</h3>
      <p className="empty-state__description">
        You don’t have any balance records at the moment.
      </p>
    </div>
  );
};
