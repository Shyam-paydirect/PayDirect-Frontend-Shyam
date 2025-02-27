// Import necessary modules
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Button } from '@mui/material';
import { AccountBalance, Contacts } from '@mui/icons-material';
import AccountDetails from './self-accounts';
import ContactDetails from './contact-details';
import axios from 'axios';
import Cookies from 'js-cookie';

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

  useEffect(() => {
    const getAuthToken = () => {
      return Cookies.get('token'); // Assuming 'token' is the key in cookies
  };
    const token = getAuthToken();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }

    const body = {
      accountNo: "8827210000027502",
      accountCcy: "INR"
    }
    const url = 'https://stage.paydirectgo.com:5000/api/balanceEnquiry';
    const response = axios.post(url, body, config)
    console.log("resspsppp", response)
  }, [])

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
      <Box>
        <Button
          variant="outlined"
          sx={{ margin: 2 }}
          onClick={() => setView(null)}
        >
          Back
        </Button>
        <AccountDetails />
      </Box>
    );
  }

  if (view === 'contactDetails') {
    return (
      <Box padding={3}>
        <Button
          variant="outlined"
          sx={{ margin: 2 }}
          onClick={() => setView(null)}
        >
          Back
        </Button>
        <ContactDetails />
      </Box>
    );
  }

  return null;
};

export default Accounts;
