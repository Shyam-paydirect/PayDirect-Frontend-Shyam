import React, { useState } from 'react';
import "./side-navbar.css";
import { RootState } from '@/app/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentDashboard } from '@/app/redux/slices/dashboardSlice';
import { useMediaQuery, useTheme } from '@mui/material';

const SideNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const [close, setClose] = useState(false);

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const currentDashboard = useSelector((state: RootState) => state.dashboard.currentDashboard); // Track the active menu item

  const toggleSidenav = () => setClose(!close);
  const closeSidenav = () => setClose(true);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuClick = (id: string) => {
    dispatch(setCurrentDashboard(id));
    isSmallScreen && setClose(true); // Close the sidebar on small screens
    document.body.classList.remove('sidebar-open'); // Remove any overlay effect
  };

  const menuItems = [
    { id: 'currency-management', icon: 'ri-copper-diamond-line', text: 'Currency Management' },
    { id: 'general-ledger', icon: 'ri-database-2-line', text: 'General Ledger' },
    { id: 'financial-reporting', icon: 'ri-bank-card-2-line', text: 'Financial Reporting' },
    { id: 'order-book', icon: 'ri-book-line', text: 'Order Book' },
    { id: 'accounts', icon: 'ri-user-settings-line', text: 'Accounts' },
  ];

  return (
    <div className="nav-body">
      {!isSmallScreen && (
        <i
          className={`ri-arrow-left-s-line toggle ${close ? 'closeToggle' : ''}`}
          onClick={toggleSidenav}
        ></i>
      )}
      <nav className={`sidebar ${close ? 'close' : ''}`}>
        <header className="header">
          {!isSmallScreen && (
            <span className="nav-closer">
              <i className="ri-close-large-line" onClick={closeSidenav}></i>
            </span>
          )}
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
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className={`navLink ${currentDashboard === item.id ? 'active' : ''}  mb-5`} // Add active class for the selected item
                  onClick={() => handleMenuClick(item.id)}
                >
                  <i className={`${item.icon} icon`}></i>
                  <span className={`text navText`}>{item.text}</span>
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
