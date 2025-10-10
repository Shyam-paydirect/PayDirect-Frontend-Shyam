import { FC } from "react";

export const DashboardFooter: FC = () => {
  return (
    <div className="dashboard-footer">
      Last updated:{" "}
      {new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })}
    </div>
  );
};
