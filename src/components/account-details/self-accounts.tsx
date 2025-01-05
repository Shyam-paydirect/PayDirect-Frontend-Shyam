
// Import necessary modules
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment } from '@mui/material';
import { Add, Delete, Search } from '@mui/icons-material';

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

const AccountDetails: React.FC = () => {
  const [ownAccounts, setOwnAccounts] = useState<Account[]>([]); // State for own accounts
  const [contactAccounts, setContactAccounts] = useState<Contact[]>([]); // State for contact accounts
  const [newAccount, setNewAccount] = useState<Account>({
    beneficiaryBank: '',
    branch: '',
    bankAddress: '',
    city: '',
    state: '',
    country: '',
    beneficiaryAccountName: '',
    beneficiaryAccountNumber: '',
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Handlers for own accounts
  const handleAddOwnAccount = () => {
    setOwnAccounts([...ownAccounts, newAccount]);
    setNewAccount({
      beneficiaryBank: '',
      branch: '',
      bankAddress: '',
      city: '',
      state: '',
      country: '',
      beneficiaryAccountName: '',
      beneficiaryAccountNumber: '',
    });
  };

  const handleDeleteOwnAccount = (index: number) => {
    setOwnAccounts(ownAccounts.filter((_, i) => i !== index));
  };

  // Handlers for contact accounts
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredContacts = contactAccounts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Accounts Section
      </Typography>

      {/* Own Account Details */}
      <Box marginBottom={5}>
        <Typography variant="h5">Your Accounts</Typography>
        <Grid container spacing={2} marginY={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Beneficiary Bank"
              fullWidth
              value={newAccount.beneficiaryBank}
              onChange={(e) => setNewAccount({ ...newAccount, beneficiaryBank: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Branch"
              fullWidth
              value={newAccount.branch}
              onChange={(e) => setNewAccount({ ...newAccount, branch: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Bank Address"
              fullWidth
              value={newAccount.bankAddress}
              onChange={(e) => setNewAccount({ ...newAccount, bankAddress: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              fullWidth
              value={newAccount.city}
              onChange={(e) => setNewAccount({ ...newAccount, city: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="State"
              fullWidth
              value={newAccount.state}
              onChange={(e) => setNewAccount({ ...newAccount, state: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Country"
              fullWidth
              value={newAccount.country}
              onChange={(e) => setNewAccount({ ...newAccount, country: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Beneficiary Account Name"
              fullWidth
              value={newAccount.beneficiaryAccountName}
              onChange={(e) => setNewAccount({ ...newAccount, beneficiaryAccountName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Beneficiary Account Number"
              fullWidth
              value={newAccount.beneficiaryAccountNumber}
              onChange={(e) => setNewAccount({ ...newAccount, beneficiaryAccountNumber: e.target.value })}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddOwnAccount}
        >
          Add Account
        </Button>

        <List>
          {ownAccounts.map((account, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDeleteOwnAccount(index)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${account.beneficiaryAccountName} - ${account.beneficiaryBank}`}
                secondary={`Account Number: ${account.beneficiaryAccountNumber}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Contact Account Details */}
      <Box>
        <Typography variant="h5">Contact Accounts</Typography>
        <TextField
          label="Search Contacts"
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          value={searchQuery}
          onChange={handleSearch}
        />

        <List>
          {filteredContacts.map((contact, index) => (
            <ListItem
              key={index}
              onClick={() => {
                setSelectedContact(contact);
                setOpenDialog(true);
              }}
            >
              <ListItemText primary={contact.name} secondary={contact.accountDetails} />
            </ListItem>
          ))}
        </List>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Contact Details</DialogTitle>
          <DialogContent>
            <Typography>
              {selectedContact ? `${selectedContact.name}: ${selectedContact.accountDetails}` : ''}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AccountDetails;






