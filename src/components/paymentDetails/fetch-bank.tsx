import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { fetchAccounts, searchAccounts } from "@/app/redux/slices/api/accountsSlice";
import { AppDispatch } from "@/app/redux/store";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  username: string;
  id?: number;
}

interface AccountSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (account: any) => void;
  accountType: "self" | "beneficiary";
}

const AccountSelectorModal: React.FC<AccountSelectorModalProps> = ({
  open,
  onClose,
  onSelect,
  accountType,
}) => {


  const token = Cookies.get('token') || "";

  let decodedToken: CustomJwtPayload | null = null; // Initialize with null

  if (token !== "") {
    decodedToken = jwtDecode<CustomJwtPayload>(token); // Assign the decoded token
  }
  const userId = decodedToken?.id || 0;

  const dispatch = useDispatch<AppDispatch>();
  const { accounts, loading } = useSelector((state: RootState) => state.accounts);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      dispatch(searchAccounts({ name: query, userId: `${userId}` }));
    } else {
      dispatch(fetchAccounts(""));
    }
  };

  const filteredAccounts = accounts.filter((account: any) => {
    return accountType === "self"
      ? account.selfAccount == 1
      : account.selfAccount == 0;
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Select {accountType === "self" ? "Own Account" : "Beneficiary Account"}
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search accounts"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ marginBottom: 2 }}
        />

        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {filteredAccounts.map((account: any, index: number) => (
              <ListItem
                key={index}
                onClick={() => {
                  onSelect(account);
                  onClose();
                }}
              >
                <ListItemText
                  primary={`${account.beneficiaryName || account.name} - ${account.bankName}`}
                  secondary={`Account Number: ${account.accountNo}`}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Box mt={2} textAlign="right">
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AccountSelectorModal;
