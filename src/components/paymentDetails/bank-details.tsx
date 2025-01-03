import React, { useState } from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    Modal,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { saveBankDetails } from "@/app/redux/slices/paymentDetailsSlice";

interface BankDetailsProps {
    openModal: boolean;
    handleCloseModal: () => void;
}

const BankDetails: React.FC<BankDetailsProps> = ({
    openModal,
    handleCloseModal,
}) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // State to handle bank details
    const [bankDetails, setBankDetails] = useState({
        swiftCode: "DBSSSGSGXXX",
        beneficiaryBank: "",
        branch: "",
        bankAddress: "",
        city: "",
        state: "",
        country: "",
        beneficiaryName: "",
        beneficiaryAccountNumber: "",
        routingNumber: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setBankDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Dispatch bank details to the Redux store
        dispatch(saveBankDetails(bankDetails));
        handleCloseModal();
    };


    return (
        <Modal open={openModal} onClose={handleCloseModal}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: isSmallScreen ? "90%" : "50%",
                    bgcolor: "background.paper",
                    maxHeight: "90vh",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: "8px",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    Add Bank Account
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="SWIFT/BIC Code"
                            placeholder="Enter the SWIFT Code to find the Bank"
                            value={bankDetails.swiftCode}
                            // onChange={(e) => handleInputChange("swiftCode", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" fullWidth>
                            Fetch Bank Details
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Beneficiary Bank"
                            placeholder="Enter the Name of the bank"
                            value={bankDetails.beneficiaryBank}
                            onChange={(e) =>
                                handleInputChange("beneficiaryBank", e.target.value)
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Branch"
                            placeholder="Enter the Branch of the bank"
                            value={bankDetails.branch}
                            onChange={(e) => handleInputChange("branch", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Bank Address"
                            placeholder="Enter the Address of the bank"
                            value={bankDetails.bankAddress}
                            onChange={(e) => handleInputChange("bankAddress", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="City"
                            placeholder="Enter the City of the bank"
                            value={bankDetails.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="State"
                            placeholder="Enter the State of the bank"
                            value={bankDetails.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Country"
                            placeholder="Enter the Country of the bank"
                            value={bankDetails.country}
                            onChange={(e) => handleInputChange("country", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Beneficiary Account Name"
                            placeholder="Enter the Beneficiary Account Name"
                            value={bankDetails.beneficiaryName}
                            onChange={(e) =>
                                handleInputChange("beneficiaryName", e.target.value)
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Beneficiary Account Number"
                            placeholder="Enter the Beneficiary Account Number"
                            value={bankDetails.beneficiaryAccountNumber}
                            onChange={(e) =>
                                handleInputChange("beneficiaryAccountNumber", e.target.value)
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Routing Number/Sort Code"
                            placeholder="Enter the Routing Number or Sort Code"
                            value={bankDetails.routingNumber}
                            onChange={(e) =>
                                handleInputChange("routingNumber", e.target.value)
                            }
                        />
                    </Grid>
                </Grid>
                <Box mt={3} textAlign="center">
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={handleSave}
                    >
                        Save Bank Account
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default BankDetails;
