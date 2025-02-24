// Import necessary modules
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, Button, Grid, IconButton, List, ListItem, ListItemText, CircularProgress, Card, CardContent } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { createAccount, fetchAccounts } from '@/app/redux/slices/api/accountsSlice';
import { RootState } from '@/app/redux/store';
import { AppDispatch } from '@/app/redux/store';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  username: string;
  id?: number;
}

const AccountDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, loading, error } = useSelector((state: RootState) => state.accounts);
  const token = Cookies.get('token') || "";

  let decodedToken: CustomJwtPayload | null = null; // Initialize with null

  if (token !== "") {
    decodedToken = jwtDecode<CustomJwtPayload>(token); // Assign the decoded token
  }
  const userId = decodedToken?.id || 0;
  const [newAccount, setNewAccount] = useState({
    userId: `${userId}`,
    name: "",
    accountNo: "",
    swiftBic: "",
    IFSC: "",
    UPI_ID: "",
    bankName: "",
    bankAddress: "",
    beneficiaryAddresses: [
      { address: "" },
      { address: "" },
      { address: "" },
    ],
    branchCode: "",
    micrCode: "",
    selfAccount: 1
  });

  const addressRegex = /^[a-zA-Z0-9\s,-]+$/; // Allows letters, numbers, spaces, commas, and hyphens

  const [errors, setErrors] = useState({
    bankAddress: "",
    city: "",
    state: "",
    country: "",
  });

  // Validation function
  const validateField = (field: string, value: string) => {
    if (!addressRegex.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "Invalid characters used. Only letters, numbers, spaces, hyphens (-), and commas (,) are allowed.",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    validateField(field, value);
    setNewAccount((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    dispatch(fetchAccounts(`${userId}`));
  }, [dispatch, userId]);

  const handleAddAccount = async () => {
    await dispatch(createAccount(newAccount));
    setNewAccount({
      userId: `${userId}`,
      name: "",
      accountNo: "",
      swiftBic: "DBSSSGSGXXX",
      IFSC: "",
      UPI_ID: "",
      bankName: "",
      bankAddress: "",
      beneficiaryAddresses: [
        { address: "" },
        { address: "" },
        { address: "" },
      ],
      branchCode: "",
      micrCode: "",
      selfAccount: 1

    });
    dispatch(fetchAccounts(`${userId}`)); // Refresh the account list
  };

  return (
    <Box padding={3} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", marginBottom: 3 }}>
        Manage Your Accounts
      </Typography>

      {/* Add New Account */}
      <Card sx={{ marginBottom: 5, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>Add New Account</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                fullWidth
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Number"
                fullWidth
                value={newAccount.accountNo}
                onChange={(e) => setNewAccount({ ...newAccount, accountNo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="SWIFT BIC"
                fullWidth
                value={newAccount.swiftBic}
                // disabled
                onChange={(e) => setNewAccount({ ...newAccount, swiftBic: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="IFSC"
                fullWidth
                value={newAccount.IFSC}
                onChange={(e) => setNewAccount({ ...newAccount, IFSC: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="UPI ID"
                fullWidth
                value={newAccount.UPI_ID}
                onChange={(e) => setNewAccount({ ...newAccount, UPI_ID: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Bank Name"
                fullWidth
                value={newAccount.bankName}
                onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bank Address"
                fullWidth
                value={newAccount.bankAddress}
                onChange={(e) => handleInputChange("bankAddress", e.target.value)}
                error={!!errors.bankAddress}
                helperText={errors.bankAddress} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Beneficiary Addresses</Typography>
              <Grid container spacing={1}>
                {newAccount.beneficiaryAddresses.map((address, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <TextField
                      label={`Address ${index + 1}`}
                      fullWidth
                      value={address.address}
                      onChange={(e) => {
                        const validValue = e.target.value.replace(/[^a-zA-Z0-9\s,-]/g, ""); // Allow letters, numbers, space, comma, and hyphen
                        const updatedAddresses = [...newAccount.beneficiaryAddresses];
                        updatedAddresses[index].address = validValue;
                        setNewAccount({ ...newAccount, beneficiaryAddresses: updatedAddresses });
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Branch Code"
                fullWidth
                value={newAccount.branchCode}
                onChange={(e) => setNewAccount({ ...newAccount, branchCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="MICR Code"
                fullWidth
                value={newAccount.micrCode}
                onChange={(e) => setNewAccount({ ...newAccount, micrCode: e.target.value })}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddAccount}
            sx={{ marginTop: 2 }}
          >
            Add Account
          </Button>
        </CardContent>
      </Card>

      {/* List of Accounts */}
      <Card sx={{ boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>Your Accounts</Typography>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <List>
              {accounts
                ?.filter((account: any) => account.selfAccount == 1) // Filter accounts with selfAccount == 1
                .map((account: any, index: number) => (
                  <ListItem
                    key={index}
                    sx={{
                      borderBottom: "1px solid #e0e0e0",
                      paddingBottom: 1,
                      marginBottom: 1,
                    }}
                  >
                    <ListItemText
                      primary={`${account.name} - ${account.bankName}`}
                      secondary={`Account Number: ${account.accountNo}`}
                    />
                    {/* <IconButton edge="end" color="error"> */}
                    {/* <Delete /> */}
                    {/* </IconButton> */}
                  </ListItem>
                ))}

            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountDetails;