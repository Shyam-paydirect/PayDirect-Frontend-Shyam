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
        swiftCode: "DBSSINBBXXX",
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

    const [errors, setErrors] = useState({
        swiftCode: false,
        beneficiaryBank: false,
        branch: false,
        bankAddress: false,
        city: false,
        state: false,
        country: false,
        beneficiaryName: false,
        beneficiaryAccountNumber: false,
        routingNumber: false,
    });

    const handleInputChange = (field: string, value: string) => {
        setBankDetails((prev) => ({ ...prev, [field]: value }));
    };

    const validateFields = () => {
        const newErrors = {
            swiftCode: bankDetails.swiftCode.trim() === "",
            beneficiaryBank: bankDetails.beneficiaryBank.trim() === "",
            branch: bankDetails.branch.trim() === "",
            bankAddress: bankDetails.bankAddress.trim() === "",
            city: bankDetails.city.trim() === "",
            state: bankDetails.state.trim() === "",
            country: bankDetails.country.trim() === "",
            beneficiaryName: bankDetails.beneficiaryName.trim() === "",
            beneficiaryAccountNumber: !/^\d{8,20}$/.test(bankDetails.beneficiaryAccountNumber.trim()),
            routingNumber: bankDetails.routingNumber.trim() === "",
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const isButtonDisabled = () => {
        return Object.values(errors).some((error) => error) ||
            Object.values(bankDetails).some((value) => value.trim() === "") ||
            !/^\d{8,20}$/.test(bankDetails.beneficiaryAccountNumber.trim());
    };

    const handleSave = () => {
        if (!validateFields()) {
            return;
        }
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
                            onChange={(e) =>
                                handleInputChange("swiftCode", e.target.value)
                            }
                            error={errors.swiftCode}
                            helperText={
                                errors.swiftCode && "This field is required."
                            }
                            disabled
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
                            error={errors.beneficiaryBank}
                            helperText={
                                errors.beneficiaryBank && "This field is required."
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
                            error={errors.branch}
                            helperText={errors.branch && "This field is required."}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Bank Address"
                            placeholder="Enter the Address of the bank"
                            value={bankDetails.bankAddress}
                            onChange={(e) => handleInputChange("bankAddress", e.target.value)}
                            error={errors.bankAddress}
                            helperText={errors.bankAddress && "This field is required."}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="City"
                            placeholder="Enter the City of the bank"
                            value={bankDetails.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            error={errors.city}
                            helperText={errors.city && "This field is required."}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="State"
                            placeholder="Enter the State of the bank"
                            value={bankDetails.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            error={errors.state}
                            helperText={errors.state && "This field is required."}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Country"
                            placeholder="Enter the Country of the bank"
                            value={bankDetails.country}
                            onChange={(e) => handleInputChange("country", e.target.value)}
                            error={errors.country}
                            helperText={errors.country && "This field is required."}
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
                            error={errors.beneficiaryName}
                            helperText={
                                errors.beneficiaryName && "This field is required."
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
                            error={errors.beneficiaryAccountNumber}
                            helperText={
                                errors.beneficiaryAccountNumber
                                    ? "Account number must be between 8 and 20 digits."
                                    : ""
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
                            error={errors.routingNumber}
                            helperText={
                                errors.routingNumber && "This field is required."
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
                        disabled={isButtonDisabled()}
                    >
                        Save Bank Account
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default BankDetails;
