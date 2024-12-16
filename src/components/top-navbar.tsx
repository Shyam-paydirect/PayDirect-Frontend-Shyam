import React, { useState } from 'react';
// import "./top-navbar.css";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import "@/styles/global.css";
import { styled } from '@mui/system';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar } from '@mui/material';
import { WbSunny, NightlightRound, Notifications, Fullscreen, FullscreenExit } from '@mui/icons-material';
import { toggleDarkMode } from '@/app/redux/slices/uiSlice';
import UserProfileMenu from './logout-menu';

const TopNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dashboardTitle = useSelector((state: RootState) => state.dashboard.dashboardTitle)

  const getDashboardTitle = (dashboard: string) => {
    switch (dashboard) {
      case 'currency-management':
        return 'Currency Management';
      case 'general-ledger':
        return 'General Ledger';
      case 'financial-reporting':
        return 'Financial Reporting';
      case 'admin-portal':
        return 'Admin Portal';
      default:
        return 'General Ledger';
    }
  };

  // const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const toggleTheme = () => {
    // setIsDarkMode(!isDarkMode);
    dispatch(toggleDarkMode())
    document.body.classList.toggle('dark', !isDarkMode);
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        height: '65px',
        top: 0,
        zIndex: 10,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--bg-clr-1)',
        borderBottom: '1px solid #cccc',
        transition: 'var(--tran-04)',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <Toolbar disableGutters sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', minHeight: '55px'}}>
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            fontSize: { xs: '20px', sm: '22px', md: '28px' },
            marginBottom: 0,
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            color: 'var(--body-text-clr)',
            textOverflow: 'ellipsis',
          }}
        >
          {dashboardTitle}
        </Typography>
        <Box className="controls" sx={{ display: 'flex', alignItems: 'center' }}>
          <ul className="control-list" style={{ display: 'flex', margin: 0, padding: 0 }}>
            {/* Theme Toggle */}
            <li className="mode">
              <IconButton
                onClick={toggleTheme}
                sx={{
                  padding: '10px',
                  margin: '14px 5px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  transition: 'var(--tran-04)',
                  '&:hover': {
                    backgroundColor: 'var(--bg-clr-2)',
                    cursor: 'pointer',
                  },
                  alignSelf: 'center',
                }}
              >
                {isDarkMode ? (
                  <NightlightRound sx={{ color: 'var(--text-color)' }} /> 
                ) : (
                  <WbSunny sx={{ color: '#ffcc33' }} /> 
                )}
              </IconButton>
            </li>
            {/* Fullscreen Toggle */}
            <li>
              <IconButton
                onClick={toggleFullScreen}
                sx={{
                  padding: '10px',
                  margin: '14px 5px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  transition: 'var(--tran-04)',
                  '&:hover': {
                    backgroundColor: 'var(--bg-clr-2)',
                    cursor: 'pointer',
                  },
                  color: 'var(--body-text-clr)',
                  alignSelf: 'center',
                }}
              >
                {isFullScreen ? (
                  <FullscreenExit sx={{ color: 'var(--text-color)' }} /> 
                  ) : (
                    <Fullscreen sx={{ color: 'var(--text-color)' }} /> 
                    )}
              </IconButton>
            </li>
            {/* Notifications */}
            <li className="notification">
              <IconButton
                sx={{
                  padding: '10px',
                  margin: '14px 5px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  transition: 'var(--tran-04)',
                  '&:hover': {
                    backgroundColor: 'var(--bg-clr-2)',
                    cursor: 'pointer',
                  },
                  color: 'var(--body-text-clr)',
                }}
              >
                <Notifications sx={{ color: 'var(--text-color)' }} /> 
              </IconButton>
            </li>
            {/* Profile */}
            <li 
              className="profile" 
              style={{ display: 'flex', alignItems: 'center', marginLeft: '5px', marginTop: '10px', lineHeight: '20px' }}>
              <Avatar
                onClick={handleMenuOpen}
                alt="Merchant Photo"
                src="/assets/fallback-photo.png "
                sx={{ width: 40, height: 40, margin: '5px', marginRight: '10px', alignItems: 'center' }}
              /> 
              <UserProfileMenu 
              anchorEl={anchorEl}
              isMenuOpen={isMenuOpen}
              handleMenuClose={handleMenuClose}
              />
            </li>
          </ul>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
