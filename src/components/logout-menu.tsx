import React, { useState } from 'react';
import { Avatar, Menu, MenuItem, Typography, Divider, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/redux/slices/api/authSlice';
import { useRouter } from 'next/router';
import { setCurrentDashboard } from '@/app/redux/slices/dashboardSlice';

interface CustomJwtPayload {
  username: string;
  id?: number;
}

interface UserProfileMenuProps {
  anchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  handleMenuClose: () => void;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  anchorEl,
  isMenuOpen,
  handleMenuClose,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
    handleMenuClose();
  };

  // Optionally, you can add functionality for Accounts here
  const handleAccounts = () => {
    // For example, navigate to the accounts page or simply close the menu.
    dispatch(setCurrentDashboard('account-statement'))
    handleMenuClose();
  };

  const token = Cookies.get('token') || "";

  let decodedToken: CustomJwtPayload | null = null;

  if (token !== "") {
    decodedToken = jwtDecode<CustomJwtPayload>(token);
  }

  return (
    <div>
      {/* Menu Component */}
      <Menu
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '10px',
          },
        }}
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        className="mt-60"
      >
        <Box sx={{ padding: '10px 180px 10px 20px', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar alt={decodedToken?.username} src="/path-to-avatar.jpg" />
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {decodedToken?.username}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Admin
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
          <LogoutIcon fontSize="small" sx={{ marginRight: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserProfileMenu;
