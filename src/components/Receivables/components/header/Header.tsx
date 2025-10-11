import React from 'react';

const DashboardHeader: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">EX</div>
          <div className="header-title">
            <h1>Recievables</h1>
            <p>Track your Recievables</p>
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
