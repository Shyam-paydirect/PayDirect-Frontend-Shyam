import React, { useState } from 'react';
import "./side-navbar.css";
import { RootState } from '@/app/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentDashboard } from '@/app/redux/slices/dashboardSlice';
import { useMediaQuery, useTheme } from '@mui/material';
import Cookies from 'js-cookie';

interface SideNavbarProps {
  onMenuItemClick?: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ onMenuItemClick }) => {
  const dispatch = useDispatch();
  // "close" state is used only for desktop mini-sidebar behavior
  const [close, setClose] = useState(false);

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const currentDashboard = useSelector((state: RootState) => state.dashboard.currentDashboard);

  const toggleSidenav = () => setClose(!close);
  const closeSidenav = () => setClose(true);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuClick = (id: string) => {
    dispatch(setCurrentDashboard(id));
    // If a callback is provided (mobile), call it to close the Drawer.
    if (onMenuItemClick) {
      onMenuItemClick();
    }
  };

 // Sidebar menu items
const menuItems = [
  { id: 'currency-management', icon: 'ri-copper-diamond-line', text: 'Payments' },
  { id: 'order-book', icon: 'ri-book-line', text: 'Order Book' },
  { id: 'accounts', icon: 'ri-user-settings-line', text: 'Accounts' },
  { id: 'balances-dashboard', icon: 'ri-bank-card-line', text: 'Balances' },
  { id: 'balance-transactions', icon: 'ri-exchange-line', text: 'Balance Transactions' },
  { id: 'deposits-dashboard', icon: 'ri-money-dollar-circle-line', text: 'Deposits' },
  { id: 'exchange-rates', icon: 'ri-repeat-line', text: 'Exchange Rates' } // ✅ New Tab
];


// Conditionally add Request Letter tab only if it’s not already in the array
if (Cookies.get('clientId')?.includes('UAT') && !menuItems.some(item => item.id === 'request-letter')) {
  menuItems.push({ id: 'request-letter', icon: 'ri-draft-line', text: 'Generate Request Letter' });
}



  return (
    <div className="nav-body">
      {/* Render toggle icon only on desktop */}
      {!isSmallScreen && (
        <i
          className={`ri-arrow-left-s-line toggle ${close ? 'closeToggle' : ''}`}
          onClick={toggleSidenav}
        ></i>
      )}
      {/* For mobile, ignore the "close" state and always render full sidebar */}
      <nav className={`sidebar ${(!isSmallScreen && close) ? 'close' : ''}`}>
        <header className="header">
          {!isSmallScreen && (
            <span className="nav-closer">
              <i className="ri-close-large-line" onClick={closeSidenav}></i>
            </span>
          )}
          <div className="image-text">
            {(!isSmallScreen && close) ? (
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
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className={`navLink ${currentDashboard === item.id ? 'active' : ''} mb-5`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <i className={`${item.icon} icon`}></i>
                  <span className="text navText">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SideNavbar;
