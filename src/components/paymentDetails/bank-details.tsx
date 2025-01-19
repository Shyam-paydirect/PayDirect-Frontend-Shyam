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
import AccountSelectorModal from "./fetch-bank"; // Import the selector modal

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
        micrCode: "",
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [accountType, setAccountType] = useState<"self" | "beneficiary">("self");

    const mapAccountToBankDetails = (account: any) => {
        setBankDetails({
            swiftCode: account.swiftBic || "",
            beneficiaryBank: account.bankName || "",
            branch: account.branchCode || "",
            bankAddress: account.bankAddress || "",
            city: account.beneficiaryAddresses?.[0]?.address || "",
            state: account.beneficiaryAddresses?.[1]?.address || "",
            country: account.beneficiaryAddresses?.[2]?.address || "",
            beneficiaryName: account.name || "",
            beneficiaryAccountNumber: account.accountNo || "",
            micrCode: account.micrCode || "",
        });
    };

    const handleFetchBankDetails = () => {
        setModalOpen(true);
        setAccountType("self");
    };

    const handleFetchBeneficiaryDetails = () => {
        setModalOpen(true);
        setAccountType("beneficiary");
    };

    const handleSave = () => {
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
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: "90vh",
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
                            value={bankDetails.swiftCode}
                            onChange={(e) =>
                                setBankDetails((prev) => ({
                                    ...prev,
                                    swiftCode: e.target.value,
                                }))
                            }
                            disabled
                        />
                    </Grid>
                    {/* <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleFetchBankDetails}
                        >
                            Fetch Own Account Details
                        </Button>
                    </Grid> */}
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleFetchBeneficiaryDetails}
                        >
                            Fetch Beneficiary Account Details
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Beneficiary Bank"
                            value={bankDetails.beneficiaryBank}
                            onChange={(e) =>
                                setBankDetails((prev) => ({
                                    ...prev,
                                    beneficiaryBank: e.target.value,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Branch"
                            value={bankDetails.branch}
                            onChange={(e) =>
                                setBankDetails((prev) => ({
                                    ...prev,
                                    branch: e.target.value,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Bank Address"
                            value={bankDetails.bankAddress}
                            onChange={(e) =>
                                setBankDetails((prev) => ({
                                    ...prev,
                                    bankAddress: e.target.value,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="City"
                            value={bankDetails.city}
                            onChange={(e) =>
                                setBankDetails((prev) => ({
                                    ...prev,
                                    city: e.target.value,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="State"
                            value={bankDetails.state}
                            onChange={(e) =>
                                setBankDetails((prev) => ({
                                    ...prev,
                                    state: e.target.value,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Country"
                            value={bankDetails.country}
                            onChange={(e) =>
                                setBankDetails((prev) => ({
                                    ...prev,
                                    country: e.target.value,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Beneficiary Account Name"
                            value={bankDetails.beneficiaryName}
                            onChange={(e) =>
                                setBankDetails((prev) => ({
                                    ...prev,
                                    beneficiaryName: e.target.value,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Beneficiary Account Number"
                            value={bankDetails.beneficiaryAccountNumber}
                            onChange={(e) =>
                                setBankDetails((prev) => ({
                                    ...prev,
                                    beneficiaryAccountNumber: e.target.value,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="MICR Code"
                            value={bankDetails.micrCode}
                            onChange={(e) =>
                                setBankDetails((prev) => ({
                                    ...prev,
                                    micrCode: e.target.value,
                                }))
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
                <AccountSelectorModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSelect={mapAccountToBankDetails}
                    accountType={accountType}
                />
            </Box>
        </Modal>
    );
};

export default BankDetails;
