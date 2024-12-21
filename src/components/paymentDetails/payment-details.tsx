import React, { useState } from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    Stepper,
    Step,
    StepLabel,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    useMediaQuery,
    useTheme,
    Button,
    Modal
} from "@mui/material";
import './payment-details.css';
import { useDispatch } from "react-redux";
import DocumentUploads from "../documents-upload/documents-upload";
import { saveBankDetails } from '@/app/redux/slices/paymentDetailsSlice'; // Action to save data in Redux

const PaymentDetails: React.FC = () => {
    const dispatch = useDispatch();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [openModal, setOpenModal] = useState(false);
    const [step, setStep] = useState<"bankDetails" | "documentUploads">(
        "bankDetails"
    );

    const handleNextStep = () => setStep("documentUploads");

    const handleSubmit = () => {
        setOpenModal(true);
        const bankDetails = {
            remittanceAmount,
            currency,
            dateOfTransfer,
            invoiceNumber,
            purposeCode,
          };
      
          // Dispatch the action to save details in Redux
          dispatch(saveBankDetails(bankDetails));
      
          // Optionally, clear the form after submission
          setRemittanceAmount('');
          setCurrency('USD');
          setDateOfTransfer('2025-01-01');
          setInvoiceNumber('');
          setPurposeCode('');
    }
    const handleCloseModal = () => setOpenModal(false);

    // State variables for form fields
    const [remittanceAmount, setRemittanceAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [dateOfTransfer, setDateOfTransfer] = useState('2025-01-01');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [purposeCode, setPurposeCode] = useState('');


    return (
        <div className='currency-management-parent'>

            {/* <Container
                maxWidth="md"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    backgroundColor: "#f4f4f9",
                    padding: "16px",
                    borderRadius: "8px",
                    boxShadow: 2,
                }}
            > */}
            {
                step === "bankDetails" ?
                    <Box
                        display="flex"
                        flexDirection={isSmallScreen ? "column" : "row"}
                        borderRadius="8px"
                        overflow="hidden"
                        boxShadow={2}
                        bgcolor='var(--bg-clr-1)'
                        width="100%"
                        maxWidth="900px"
                    >
                        {/* Sidebar */}
                        <Box
                            width={isSmallScreen ? "100%" : "30%"}
                            bgcolor="var(--bg-clr-2)"
                            p={3}
                            display="flex"
                            flexDirection="column"
                            alignItems={isSmallScreen ? "center" : "flex-start"}
                        >
                            <Typography
                                variant="h6"
                                align="center"
                                gutterBottom
                                sx={{ fontSize: "16px", fontWeight: "bold" }}
                            >
                                Payment Progress
                            </Typography>
                            <Stepper
                                orientation={isSmallScreen ? "horizontal" : "vertical"}
                                activeStep={0}
                                sx={{
                                    width: isSmallScreen ? "100%" : "auto",
                                    marginLeft: isSmallScreen ? 0 : "-16px",
                                }}
                            >
                                {["Payment Details", "Upload Documents", "Accept Rate and Pay", "Track Payment"].map(
                                    (label, index) => (
                                        <Step key={index}>
                                            <StepLabel
                                                sx={{
                                                    flexDirection: "column-reverse", // Keep text below the numbers
                                                    alignItems: "center",
                                                    ".MuiStepLabel-label": {
                                                        fontSize: "12px", // Reduced text size
                                                        textAlign: "center",
                                                        marginTop: "8px",
                                                        color: 'var(--text-color)'
                                                    },
                                                    ".MuiStepIcon-root": {
                                                        fontSize: "24px", // Adjust icon size if needed
                                                        // color: 'var(--body-text-clr)'
                                                    },
                                                }}
                                            >
                                                {label}
                                            </StepLabel>
                                        </Step>
                                    )
                                )}
                            </Stepper>
                        </Box>

                        {/* Payment Details Section */}
                        <Box flexGrow={1} p={3}>
                            <Typography variant="h6" gutterBottom>
                                Payment Details
                            </Typography>
                            <Grid container spacing={3}>
                                {/* Remittance Amount */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Remittance Amount"
                                        defaultValue="1,000"
                                        variant="outlined"
                                        type="number"
                                        value={remittanceAmount}
                                        onChange={(e) => setRemittanceAmount(e.target.value)}
                                        sx={{
                                            background: "var(--bg-clr-2)",
                                            "& .MuiInputBase-input": {
                                                color: "var(--text-color)", // Text color inside
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: "var(--body-text-clr)", // Label color
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{
                                        background: "var(--bg-clr-2)",
                                        "& .MuiInputBase-input": {
                                            color: "var(--text-color)", // Text color inside
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "var(--body-text-clr)", // Label color
                                        },
                                    }}>
                                        <InputLabel>Currency</InputLabel>
                                        <Select
                                            defaultValue="USD"
                                            label="Currency" value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}>
                                            <MenuItem value="USD">USD</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Expected Date of Transfer */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        value={dateOfTransfer}
                                        onChange={(e) => setDateOfTransfer(e.target.value)}
                                        label="Expected Date of Transfer"
                                        sx={{
                                            background: "var(--bg-clr-2)",
                                            "& .MuiInputBase-input": {
                                                color: "var(--text-color)", // Text color inside
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: "var(--body-text-clr)", // Label color
                                            },
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                {/* Invoice Number */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Invoice Number(s)"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                        variant="outlined"
                                        sx={{
                                            background: "var(--bg-clr-2)",
                                            "& .MuiInputBase-input": {
                                                color: "var(--text-color)", // Text color inside
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: "var(--body-text-clr)", // Label color
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Purpose Code */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth sx={{
                                        background: "var(--bg-clr-2)",
                                        "& .MuiInputBase-input": {
                                            color: "var(--text-color)", // Text color inside
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "var(--body-text-clr)", // Label color
                                        },
                                    }}>
                                        <InputLabel>Purpose Code</InputLabel>
                                        <Select
                                            defaultValue="S0101"
                                            label="Purpose Code"
                                            value={purposeCode}
                                            onChange={(e) => setPurposeCode(e.target.value)}>
                                            <MenuItem value="S0101">
                                                S0101 Advance payment against imports
                                            </MenuItem>
                                            <MenuItem value="S0102">
                                                S0102 Payment towards imports - settlement of invoice
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>


                            <Box mt={4} textAlign="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}                               
                                     >
                                    Add Bank Details
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    :
                    <DocumentUploads />
            }


            {/* Modal for adding bank details */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: isSmallScreen ? "90%" : "50%",
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "8px",
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
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" fullWidth>
                                Fetch Bank Details
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Beneficiary Bank" placeholder="Enter the Name of the bank" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Branch" placeholder="Enter the Branch of the bank" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Bank Address" placeholder="Enter the Address of the bank" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="City" placeholder="Enter the City of the bank" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="State" placeholder="Enter the State of the bank" />
                        </Grid>
                    </Grid>
                    <Box mt={3} textAlign="center">
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            onClick={() => {
                                handleNextStep();
                                handleCloseModal();
                            }}
                        >
                            Save Bank Account
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/* </Container> */}
        </div>
    );
};

export default PaymentDetails;
