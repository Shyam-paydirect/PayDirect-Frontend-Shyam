import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  TextField,
  Button,
} from '@mui/material';
import { LockReset } from '@mui/icons-material';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { changePassword } from '@/app/redux/slices/api/forgotPasswordSlice';

interface CustomJwtPayload {
  username: string;
  id?: number;
}

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();

  const token = Cookies.get('token') || "";
  let decodedToken: CustomJwtPayload | null = null;

  if (token !== "") {
    decodedToken = jwtDecode<CustomJwtPayload>(token);
  }
  const userId = decodedToken?.id || 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation: ensure none of the fields are empty
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("All fields are required.");
      return;
    }
    // Validate that newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm New Password do not match.");
      return;
    }
    // Validate that userId exists (non-zero)
    if (!userId) {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      // Dispatch the changePassword action and unwrap the result
      await dispatch(changePassword({ userId: userId.toString(), oldPassword, newPassword })).unwrap();
      alert("Password changed successfully!");
    } catch (error: any) {
      alert("Error: " + error);
    }
  };

  return (
    <Box padding={3} textAlign="center">
      <Typography variant="h4" gutterBottom>
        Change Password
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6} sx={{ mx: 'auto' }}>
          <Card
            sx={{
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'info.main',
              borderRadius: 4,
              width: { xs: '90%', sm: '350px' },
              mx: 'auto',
            }}
          >
            <CardActionArea disableRipple>
              <CardMedia>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50,
                    height: 50,
                    padding: 5,
                    margin: '0 auto',
                    borderRadius: '50%',
                  }}
                >
                  <LockReset sx={{ fontSize: 40, color: 'info.main' }} />
                </Box>
              </CardMedia>
              <CardContent>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    marginTop: 1,
                  }}
                >
                  <TextField
                    label="Old Password"
                    type="password"
                    variant="outlined"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <TextField
                    label="Confirm New Password"
                    type="password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button variant="contained" color="info" type="submit">
                    Update Password
                  </Button>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChangePassword;
