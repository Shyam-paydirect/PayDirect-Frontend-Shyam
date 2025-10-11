import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Button } from '@mui/material';
import { AccountBalance, Contacts, Receipt, PersonAdd } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setCurrentDashboard } from '@/app/redux/slices/dashboardSlice';
import AccountDetails from './self-accounts';
import ContactDetails from './contact-details';

const Accounts: React.FC = () => {
  const [view, setView] = useState<'accountDetails' | 'contactDetails' | null>(null);
  const dispatch = useDispatch();

  const handleViewAccountDetails = () => {
    setView('accountDetails');
  };

  const handleViewContactDetails = () => {
    setView('contactDetails');
  };

  // Dispatch action for Account Statement
  const handleViewAccountStatement = () => {
    dispatch(setCurrentDashboard('account-statement'));
  };

  // Dispatch action for Partner Account Creation
  const handleCreatePartnerAccount = () => {
    dispatch(setCurrentDashboard('partner-account'));
  };

  if (view === null) {
    return (
      <Box padding={3} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Welcome to the Accounts Section
        </Typography>
        {/* 2x2 Matrix Layout */}
        <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* First Row */}
          <Grid item xs={12} sm={6} md={6}>
            <Card
              onClick={handleViewAccountDetails}
              sx={{
                cursor: 'pointer',
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: 4,
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }
              }}
            >
              <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                    <AccountBalance sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                </CardMedia>
                <CardContent>
                  <Typography variant="h6">Account Details</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card
              onClick={handleViewContactDetails}
              sx={{
                cursor: 'pointer',
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'secondary.main',
                borderRadius: 4,
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }
              }}
            >
              <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                    <Contacts sx={{ fontSize: 40, color: 'secondary.main' }} />
                  </Box>
                </CardMedia>
                <CardContent>
                  <Typography variant="h6">Beneficiary Details</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          
          {/* Second Row */}
          <Grid item xs={12} sm={6} md={6}>
            <Card
              onClick={handleViewAccountStatement}
              sx={{
                cursor: 'pointer',
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'info.main',
                borderRadius: 4,
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }
              }}
            >
              <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                    <Receipt sx={{ fontSize: 40, color: 'info.main' }} />
                  </Box>
                </CardMedia>
                <CardContent>
                  <Typography variant="h6">Account Statement</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card
              onClick={handleCreatePartnerAccount}
              sx={{
                cursor: 'pointer',
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'success.main',
                borderRadius: 4,
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }
              }}
            >
              <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                    <PersonAdd sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                </CardMedia>
                <CardContent>
                  <Typography variant="h6">Create Partner Account</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (view === 'accountDetails') {
    return (
      <Box>
        <Button variant="outlined" sx={{ margin: 2 }} onClick={() => setView(null)}>
          Back
        </Button>
        <AccountDetails />
      </Box>
    );
  }

  if (view === 'contactDetails') {
    return (
      <Box padding={3}>
        <Button variant="outlined" sx={{ margin: 2 }} onClick={() => setView(null)}>
          Back
        </Button>
        <ContactDetails />
      </Box>
    );
  }

  return null;
};

export default Accounts;
