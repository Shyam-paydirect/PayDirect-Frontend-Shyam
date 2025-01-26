import React, { useState } from 'react';
// import "./top-navbar.css";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import "@/styles/global.css";
import { styled } from '@mui/system';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, useMediaQuery, useTheme, Drawer } from '@mui/material';
import { Menu, WbSunny, NightlightRound, Notifications, Fullscreen, FullscreenExit } from '@mui/icons-material';
import { toggleDarkMode } from '@/app/redux/slices/uiSlice';
import UserProfileMenu from './logout-menu';
import SideNavbar from './sideNavbar/side-navbar'; // Import SideNavbar for the drawer
import Head from "next/head";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
  username: string;
  id?: number;
}

const TopNavbar: React.FC = () => {
  const token = Cookies.get("token") || "";

  let decodedToken: CustomJwtPayload | null = null;
  if (token !== "") {
    decodedToken = jwtDecode<CustomJwtPayload>(token);
  }
  const userName = decodedToken?.username || "";

  const theme = useTheme();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dashboardTitle = useSelector((state: RootState) => state.dashboard.dashboardTitle);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
  };


  const getDashboardTitle = (dashboard: string) => {
    switch (dashboard) {
      case 'currency-management':
        return 'Payments';
      case 'general-ledger':
        return 'General Ledger';
      case 'financial-reporting':
        return 'Financial Analytics';
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

  const iconSize = isSmallScreen ? 16 : 30;

  return (
    <>
     {/* Dynamically Set Page Title */}
     <Head>
        <title>{dashboardTitle}</title>
      </Head>
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
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <Toolbar disableGutters sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 10px 10px 10px', minHeight: '55px' }}>
        {isSmallScreen && (
          <IconButton
            onClick={() => toggleDrawer(true)}
            sx={{ color: 'var(--body-text-clr)' }}
          >
            <Menu sx={{ fontSize: iconSize }} />
          </IconButton>
        )}
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
            fontSize: isSmallScreen ? '16px' : '28px',
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
            {/* <li className="mode">
              <IconButton
                onClick={toggleTheme}
                sx={{
                  padding: '10px',
                  margin: isSmallScreen ? '14px 2px' : '14px 5px',
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
                  <NightlightRound sx={{ fontSize: iconSize, color: 'var(--text-color)' }} />
                ) : (
                  <WbSunny sx={{ fontSize: iconSize, color: '#ffcc33' }} />
                )}
              </IconButton>
            </li> */}
            {/* Fullscreen Toggle */}
            <li>
              <IconButton
                onClick={toggleFullScreen}
                sx={{
                  padding: '10px',
                  margin: isSmallScreen ? '14px 2px' : '14px 5px',
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
                  <FullscreenExit sx={{ fontSize: iconSize, color: 'var(--text-color)' }} />
                ) : (
                  <Fullscreen sx={{ fontSize: iconSize, color: 'var(--text-color)' }} />
                )}
              </IconButton>
            </li>
            {/* Notifications */}
            <li className="notification">
              <IconButton
                sx={{
                  padding: '10px',
                  margin: isSmallScreen ? '14px 2px' : '14px 5px',
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
                <Notifications sx={{ fontSize: iconSize, color: 'var(--text-color)' }} />
              </IconButton>
            </li>
            {/* Profile */}
            <li
              className="profile"
              style={{
                padding: isSmallScreen ? '0px' : '10px',
                display: 'flex',
                alignItems: 'center',
                // marginLeft: '5px',
                // marginTop: '10px',
                lineHeight: '20px'
              }}>
              <Avatar
                onClick={handleMenuOpen}
                alt={userName}
                src="/assets/fallback-photo.png"
                sx={{ width: isSmallScreen ? 30 : 35, height: isSmallScreen ? 30 : 35, margin: isSmallScreen ? '6px' : '5px', alignItems: 'center' }}
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
      {isSmallScreen &&
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={() => toggleDrawer(false)}
          slotProps={{
            backdrop: {
              style: { backgroundColor: 'transparent' }, // Removes the dark overlay
            },
          }}
        >
          <SideNavbar />
        </Drawer>
      }
    </AppBar>
    </>
  );
};

export default TopNavbar;
