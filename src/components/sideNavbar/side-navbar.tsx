
// SideNavbar.tsx (Side navigation bar)
import React, { useState } from 'react';
import "./side-navbar.css";
import { RootState } from '@/app/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentDashboard } from '@/app/redux/slices/dashboardSlice';


const SideNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const [close, setClose] = useState(false);

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode)

  const toggleSidenav = () => setClose(!close);
  const closeSidenav = () => setClose(true);
  const selectDashboard = (dashboard: string) => {
    setCurrentDashboard(dashboard);
  };

  return (
    
    <div className="nav-body">
      <i
        className={`ri-arrow-left-s-line toggle ${close ? 'closeToggle' : ''}`}
        onClick={toggleSidenav}
      ></i>
      <nav className={`sidebar ${close ? 'close' : ''}`}>
        <header className="header">
          <span className="nav-closer">
            <i className="ri-close-large-line" onClick={closeSidenav}></i>
          </span>
          <div className="image-text">
            {close ? (
              <span className="image">
                <img src={isDarkMode ? "/assets/svg/logos/logoDark.svg" : "/assets/svg/logos/logo.svg"} alt="Logo" />
              </span>
            ) : (
              <div className="text headerText">
                <span className="logoFull">
                  <img src={isDarkMode ? "/assets/svg/logos/logoNameDark.svg" : "/assets/svg/logos/logoName.svg"} alt="Logo" />
                </span>
              </div>
            )}
          </div>
        </header>
        <hr />
        <div className="menuBar">
          <div className="menu">
            <ul className="menuLinks">
              <a onClick={() => dispatch(setCurrentDashboard('currency-management'))}>
                <li className="navLink">
                  <i className="ri-copper-diamond-line icon"></i>
                  <span className="text navText">Currency Management</span>
                </li>
              </a>
              <a onClick={() => dispatch(setCurrentDashboard('general-ledger'))}>
                <li className="navLink">
                  <i className="ri-database-2-line icon"></i>
                  <span className="text navText">General Ledger</span>
                </li>
              </a>
              <a onClick={() => dispatch(setCurrentDashboard('financial-reporting'))}>
                <li className="navLink">
                  <i className="ri-bank-card-2-line icon"></i>
                  <span className="text navText">Financial Reporting</span>
                </li>
              </a>
              <a onClick={() => dispatch(setCurrentDashboard('taxation-compliance'))}>
                <li className="navLink">
                  <i className="ri-store-2-line icon"></i>
                  <span className="text navText">Taxation and Compliance</span>
                </li>
              </a>
              <a onClick={() => dispatch(setCurrentDashboard('access-security'))}>
                <li className="navLink">
                  <i className="ri-projector-line icon"></i>
                  <span className="text navText">Access and Security</span>
                </li>
              </a>
              <a onClick={() => dispatch(setCurrentDashboard('third-party-integration'))}>
                <li className="navLink">
                  <i className="ri-service-line icon"></i>
                  <span className="text navText">Third-Party Integration</span>
                </li>
              </a>
              <a onClick={() => dispatch(setCurrentDashboard('accounts'))}>
                <li className="navLink">
                  <i className="ri-user-settings-line icon"></i>
                  <span className="text navText">Accounts</span>
                </li>
              </a>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SideNavbar;