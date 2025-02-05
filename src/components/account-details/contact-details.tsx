// Import necessary modules
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tooltip, Typography, TextField, Button, Grid, IconButton, List, ListItem, ListItemText, CircularProgress, Card, CardContent } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { createAccount, fetchAccounts, searchAccounts } from '@/app/redux/slices/api/accountsSlice';
import { RootState } from '@/app/redux/store';
import { AppDispatch } from '@/app/redux/store';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import InfoIcon from '@mui/icons-material/Info';

interface CustomJwtPayload {
  username: string;
  id?: number;
}

const ContactDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, loading, error } = useSelector((state: RootState) => state.accounts);
  const token = Cookies.get('token') || "";

  let decodedToken: CustomJwtPayload | null = null; // Initialize with null

  if (token !== "") {
    decodedToken = jwtDecode<CustomJwtPayload>(token); // Assign the decoded token
  }
  const userId = decodedToken?.id || 0;
  const [newContact, setNewContact] = useState({
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
    selfAccount: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");

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
    setNewContact((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    dispatch(fetchAccounts(`${userId}`));
  }, [dispatch, userId]);

  const handleAddContact = async () => {
    await dispatch(createAccount(newContact));
    setNewContact({
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
      selfAccount: 0,
    });
    dispatch(fetchAccounts(`${userId}`)); // Refresh the contact list
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      dispatch(searchAccounts({ name: query, userId: `${userId}` }));
    } else {
      dispatch(fetchAccounts(`${userId}`));
    }
  };

  return (
    <Box padding={3} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", marginBottom: 3 }}>
        Manage Your Contacts
      </Typography>

      {/* Add New Contact */}
      <Card sx={{ marginBottom: 5, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>Add New Contact</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Beneficiary Name"
                fullWidth
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Number"
                fullWidth
                value={newContact.accountNo}
                onChange={(e) => setNewContact({ ...newContact, accountNo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="SWIFT BIC"
                fullWidth
                value={newContact.swiftBic}
                disabled
                onChange={(e) => setNewContact({ ...newContact, swiftBic: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="IFSC"
                fullWidth
                value={newContact.IFSC}
                onChange={(e) => setNewContact({ ...newContact, IFSC: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="UPI ID"
                fullWidth
                value={newContact.UPI_ID}
                onChange={(e) => setNewContact({ ...newContact, UPI_ID: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Bank Name"
                fullWidth
                value={newContact.bankName}
                onChange={(e) => setNewContact({ ...newContact, bankName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bank Address"
                fullWidth
                value={newContact.bankAddress}
                onChange={(e) => handleInputChange("bankAddress", e.target.value)}
                error={!!errors.bankAddress}
                helperText={errors.bankAddress} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Beneficiary Addresses
                <Tooltip title="Please enter International Bank Account details">
                  <IconButton size="small" sx={{ marginLeft: 1 }}>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Grid container spacing={1}>
                {newContact.beneficiaryAddresses.map((address, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <TextField
                      label={`Address ${index + 1}`}
                      fullWidth
                      value={address.address}
                      onChange={(e) => {
                        const validValue = e.target.value.replace(/[^a-zA-Z0-9\s,-]/g, ""); // Allow letters, numbers, space, comma, and hyphen
                        const updatedAddresses = [...newContact.beneficiaryAddresses];
                        updatedAddresses[index].address = validValue;
                        setNewContact({ ...newContact, beneficiaryAddresses: updatedAddresses });
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
                value={newContact.branchCode}
                onChange={(e) => setNewContact({ ...newContact, branchCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="MICR Code"
                fullWidth
                value={newContact.micrCode}
                onChange={(e) => setNewContact({ ...newContact, micrCode: e.target.value })}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddContact}
            sx={{ marginTop: 2 }}
          >
            Add Contact
          </Button>
        </CardContent>
      </Card>

      {/* List of Contacts */}
      <Card sx={{ boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
            <Typography variant="h5">Your Contacts</Typography>
            <TextField
              label="Search by Beneficiary Name"
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              variant="outlined"
            />
          </Box>
          {loading ? (
            <CircularProgress />
          ) : (
            <List>
              {accounts
                ?.filter((account: any) => account.selfAccount == 0) // Filter contacts with selfAccount == 0
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
                  </ListItem>
                ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContactDetails;
