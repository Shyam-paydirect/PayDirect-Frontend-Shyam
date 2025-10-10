import { FC } from "react";

export const LoadingState: FC = () => {
  return (
    <div className="loading-state">
      <div className="loading-state__container">
        <div className="loading-state__pulse">
          {/* Header skeleton */}
          <div className="loading-state__header"></div>

          {/* Card skeletons */}
          <div className="loading-state__cards">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="loading-state__card"></div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className="loading-state__table"></div>
        </div>
      </div>
    </div>
  );
};
