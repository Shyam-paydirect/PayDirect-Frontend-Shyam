import React from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { setCurrentDashboard } from '@/app/redux/slices/dashboardSlice';
import { useSelector, useDispatch } from 'react-redux';

interface SendPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendPaymentModal: React.FC<SendPaymentModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
  
 const handlePaymentDetails = () => {
    localStorage.setItem("prev_component", 'currency-management')
    dispatch(setCurrentDashboard('payment-details'));
  }

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="send-payment-modal">
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Typography variant="h6" id="send-payment-modal" gutterBottom>
          Send Payment
        </Typography>
        {/* <Typography variant="body2" gutterBottom>
          Select an order for which you would like to make payment
        </Typography> */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          fullWidth
          onClick={handlePaymentDetails}
        >
          Create Order
        </Button>
        {/* <List>
          <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <ListItemText
                primary="IO8749623791"
                secondary="DESIGNATRONICS INC."
              />
            </Box>
            <Typography variant="body1" fontWeight="bold">
              $1,558.37
            </Typography>
          </ListItem>
          <Divider />
          <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <ListItemText
                primary="IO5515390446"
                secondary="DESIGNATRONICS INC."
              />
            </Box>
            <Typography variant="body1" fontWeight="bold">
              $1,034.42
            </Typography>
          </ListItem>
        </List> */}
        {/* <Button
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
          fullWidth
        >
          Send Payment
        </Button> */}
      </Box>
    </Modal>
  );
};

export default SendPaymentModal;
