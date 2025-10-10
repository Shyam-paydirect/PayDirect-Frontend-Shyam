import React from 'react';

const DashboardHeader: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">D</div>
          <div className="header-title">
            <h1>Deposits</h1>
            <p>Manage and track your deposits</p>
          </div>
        </div>
        <div className="header-right">
          <button className="icon-btn">🔔</button>
          <div className="avatar"></div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
