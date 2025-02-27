import React, { useState } from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";// Adjust the import to your store location
import { verifyOtp } from "@/app/redux/slices/api/txnOtpSlice";
import { toast } from "react-toastify";

interface OTPDialogProps {
    open: boolean;
    onClose: () => void;
    transactionId: string;
    onConfirm: () => void;
}

const OTPDialog: React.FC<OTPDialogProps> = ({ open, onClose, transactionId, onConfirm }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [otp, setOtp] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            const response = await dispatch(verifyOtp({ transactionId, otp })).unwrap();
            if (response.errorCode === 0) {
                toast.success("OTP verified successfully!");
                onConfirm();
            } else {
                toast.error("Invalid OTP. Please try again.");
            }
        } catch (error) {
            const errorMessage =
                typeof error === "string"
                    ? error
                    : error instanceof Error
                        ? error.message
                        : "An unknown error occurred";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    An OTP has been sent to your registered email-id. Please enter it below to authenticate your transaction.
                </Typography>
                <TextField
                    fullWidth
                    label="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    inputProps={{ maxLength: 6 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    color="primary"
                    variant="contained"
                    disabled={isSubmitting || otp.length !== 6}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OTPDialog;
