import React, { useState } from 'react';
import { Avatar, Button, Menu, MenuItem, Typography, Divider, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/redux/slices/api/authSlice';
import { useRouter } from 'next/router';

interface CustomJwtPayload {
    username: string;
    id?: number;
    exp?: number;
    iat?: number;
  }
  

const UserProfileMenu: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
            dispatch(logout());
            router.push('/')
    };

    const token = Cookies.get('token') || "";

    const decodedToken: CustomJwtPayload = jwtDecode<CustomJwtPayload>(token);

    return (
        <div>
            {/* Menu Component */}
            <Menu
                sx={
                    {
                        '& .MuiPaper-root': {
                            borderRadius: '10px',
                        }
                    }}
                anchorEl={anchorEl}
                open={true}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                // transformOrigin={{
                //     vertical: 'top',
                //     horizontal: 'right',
                // }}
                className='mt-60'
            >
                <Box sx={{ padding: '10px 180px 10px 20px', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar alt="User Avatar" src="/path-to-avatar.jpg" />
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
                <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
                    <LogoutIcon fontSize="small" sx={{ marginRight: 1 }} />
                    Logout
                </MenuItem>
            </Menu>
        </div>
    );
};

export default UserProfileMenu;
