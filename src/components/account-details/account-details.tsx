// Import necessary modules
import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { AccountBalance, Contacts } from '@mui/icons-material';
import AccountDetails from './self-accounts';

interface Account {
  beneficiaryBank: string;
  branch: string;
  bankAddress: string;
  city: string;
  state: string;
  country: string;
  beneficiaryAccountName: string;
  beneficiaryAccountNumber: string;
}

interface Contact {
  name: string;
  accountDetails: string;
}

const Accounts: React.FC = () => {
  const [view, setView] = useState<'accountDetails' | 'contactDetails' | null>(null);

  // Navigate to Account Details
  const handleViewAccountDetails = () => {
    setView('accountDetails');
  };

  // Navigate to Contact Details
  const handleViewContactDetails = () => {
    setView('contactDetails');
  };

  if (view === null) {
    return (
      <Box padding={3} textAlign="center" bgcolor="#f0f4ff" minHeight="100vh">
        <Typography variant="h4" gutterBottom>
          Welcome to the Accounts Section
        </Typography>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card
              onClick={handleViewAccountDetails}
              sx={{ cursor: 'pointer', textAlign: 'center', border: '1px solid', borderColor: 'primary.main', borderRadius: 4 }}
            >
              <CardActionArea>
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
                    //   border: '2px solid',
                    //   borderColor: 'primary.main',
                      borderRadius: '50%',
                    }}
                  >
                    <AccountBalance
                      sx={{
                        fontSize: 40,
                        color: 'primary.main',
                      }}
                    />
                  </Box>
                </CardMedia>
                <CardContent>
                  <Typography variant="h6">
                    Account Details
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              onClick={handleViewContactDetails}
              sx={{ cursor: 'pointer', textAlign: 'center', border: '1px solid', borderColor: 'secondary.main', borderRadius: 4 }}
            >
              <CardActionArea>
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
                    //   border: '2px solid',
                    //   borderColor: 'secondary.main',
                      borderRadius: '50%',
                    }}
                  >
                    <Contacts
                      sx={{
                        fontSize: 40,
                        color: 'secondary.main',
                      }}
                    />
                  </Box>
                </CardMedia>
                <CardContent>
                  <Typography variant="h6">
                    Contact Details
                  </Typography>
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
      <AccountDetails />
    );
  }

  if (view === 'contactDetails') {
    return (
      <Box padding={3}>
        <Typography variant="h4" gutterBottom>
          Your Contact Details
        </Typography>
        {/* Add the existing Contact Details Component here */}
        <Typography variant="h6">(Contact Details Component goes here)</Typography>
        <Typography
          variant="button"
          onClick={() => setView(null)}
          sx={{ cursor: 'pointer', color: 'primary.main', marginTop: 2, display: 'block' }}
        >
          Back
        </Typography>
      </Box>
    );
  }

  return null;
};

export default Accounts;
