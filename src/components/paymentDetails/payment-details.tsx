import React, { useState, useEffect } from "react";
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
    CircularProgress,
    Modal
} from "@mui/material";
import './payment-details.css';
import { useDispatch, useSelector } from "react-redux";
import DocumentUploads from "../documents-upload/documents-upload";
import { savePaymentDetails } from '@/app/redux/slices/paymentDetailsSlice'; // Action to save data in Redux
import BankDetails from "./bank-details";
import { RootState } from "@/app/redux/store"; // Adjust based on your store setup
import { submitPayment } from "@/app/redux/slices/api/ttPaymentSlice";
import { AppDispatch } from '@/app/redux/store';
import { toast, ToastContainer } from "react-toastify";
import { createOrder, fetchAllOrders, CreateOrderRequest, selectOrderState } from '@/app/redux/slices/api/orderSlice';

const PaymentDetails: React.FC = () => {
    const dispatch = useDispatch();
    const dispatchApi = useDispatch<AppDispatch>();

    const [isLoading, setIsLoading] = useState(false);

    // State variables for form fields
    const [remittanceAmount, setRemittanceAmount] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [dateOfTransfer, setDateOfTransfer] = useState('2025-01-01');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [purposeCode, setPurposeCode] = useState('');
    const [customerReference, setCustomerReference] = useState("");
    const [errors, setErrors] = useState({
        remittanceAmount: false,
        dateOfTransfer: false,
        invoiceNumber: false,
        purposeCode: false,
    });

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [openModal, setOpenModal] = useState(false);
    const [step, setStep] = useState<"bankDetails" | "documentUploads">(
        "bankDetails"
    );

    useEffect(() => {
        const number = generateRandom11DigitNumber();
        setCustomerReference("TT" + number);
    }, []);

    const bankDetails = useSelector((state: RootState) => state.paymentDetails.bankDetails);

    const handleNextStep = () => setStep("documentUploads");
    const generateRandom11DigitNumber = () => {
        return Math.floor(1e10 + Math.random() * 9e10).toString();
    };

    const validateFields = () => {
        const newErrors = {
            remittanceAmount: remittanceAmount === '',
            dateOfTransfer: dateOfTransfer === '',
            invoiceNumber: invoiceNumber === '',
            purposeCode: purposeCode === '',
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some((error) => error);
    };

    const paymentData = {
        txnAmount: remittanceAmount,
        customerReference: "TT" + generateRandom11DigitNumber(),
        txnCcy: currency,
        debitAccountAmount: remittanceAmount,
        purposeOfPayment: "OTHR",
        chargeBearer: "DEBT",
        senderParty: {
            name: "ProductStackArrayTechnologies PVT LTD",
            accountNo: "8827210000027502",
            swiftBic: "DBSSINBBXXX",
        },
        receivingParty: {
            name: bankDetails.beneficiaryName,
            accountNo: bankDetails.beneficiaryAccountNumber,
            swiftBic: bankDetails.swiftCode,
            bankName: bankDetails.beneficiaryBank,
            bankAddress: bankDetails.bankAddress,
            beneficiaryAddresses: [
                { address: bankDetails.city },
                { address: bankDetails.state },
                { address: bankDetails.country },
            ],
        },
        advisoryEmail: "beneficiary@example.com",
        paymentDetail: "TT Payment Details",
        clientReference: "ClientRef123",
        invoice: "Invoice Details 01"
    };

    const handleTTPaymentDetails = async () => {
        if (!validateFields()) {
            toast.error("Please fill out all required fields.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await dispatchApi(submitPayment(paymentData)).unwrap();
            const orderData: CreateOrderRequest = {
                orderId: customerReference,
                msgId: response?.data?.header?.msgId,
                orgId: response?.data?.header?.orgId,
                timeStamp: response?.data?.header?.timeStamp,
                paymentMode: 'TT',
                responseType: response?.data?.txnResponses[0]?.responseType,
                txnStatus: response?.data?.txnResponses[0]?.txnStatus,
                txnStatusDescription: response?.data?.txnResponses[0]?.txnStatusDescription,
                sendingPartyName: "Sender Name",
                sendingPartyAccountNo: "8827210000027502",
                receivingPartyName: bankDetails.beneficiaryName,
                receivingPartyAccountNo: bankDetails.beneficiaryAccountNumber
            }
            await handleOrderCreation(orderData);
            toast.success(response?.message, {
                onClose: () => {
                    handleNextStep();
                },
            });
        }
        catch (error) {
            const errorMessage =
                typeof error === "string"
                    ? error
                    : error instanceof Error
                        ? error.message
                        : "An unknown error occurred";
            toast.dismiss();
            toast.error(errorMessage)
            //   setErrorMsg(errorMessage)
        }
        finally {
            setIsLoading(false); // Reset loading state
        }
    }

    const handleOrderCreation = async (orderData: CreateOrderRequest) => {

        try {
            const response = await dispatchApi(createOrder(orderData)).unwrap();

        }
        catch (error) {
            const errorMessage =
                typeof error === "string"
                    ? error
                    : error instanceof Error
                        ? error.message
                        : "An unknown error occurred";
            toast.dismiss();
            toast.error(errorMessage)
            //   setErrorMsg(errorMessage)
        }
    }

    const steps = [
        {
            label: "Payment Details",
            description: "Enter the amount and account details for the payment",
        },
        {
            label: "Upload Documents",
            description: "Upload all the documents required for this payment",
        },
        {
            label: "Accept Rate and Pay",
            description: "Once the documents are verified, accept the best rate and initiate payment",
        },
        {
            label: "Track Payment",
            description: "Easily track your payment and download the SWIFT Receipt",
        },
    ];

    const handleBankDetails = () => {
        setOpenModal(true);
        const paymentDetails = {
            remittanceAmount,
            currency,
            dateOfTransfer,
            invoiceNumber,
            purposeCode,
        };

        // Dispatch the action to save details in Redux
        dispatch(savePaymentDetails(paymentDetails));

        // Optionally, clear the form after submission
        setRemittanceAmount('');
        setCurrency('INR');
        setDateOfTransfer('2025-01-01');
        setInvoiceNumber('');
        setPurposeCode('');
    }
    const handleCloseModal = () => setOpenModal(false);

    return (
        <>
            <ToastContainer />
            <div className='payment-details-parent'>
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
                        // maxWidth="900px"
                        >
                            {/* Sidebar */}
                            <Box
                                width={isSmallScreen ? "100%" : "30%"}
                                bgcolor="var(--bg-clr-1)"
                                p={3}
                                display="flex"
                                flexDirection="column"
                                alignItems={isSmallScreen ? "center" : "center"}
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
                                        ".MuiStepConnector-root": {
                                            marginLeft: "auto", // Adjusts position to center
                                            marginRight: "auto",
                                            width: isSmallScreen ? "50%" : "auto", // For horizontal/vertical stepper
                                        },
                                        width: isSmallScreen ? "100%" : "auto",
                                        // marginLeft: isSmallScreen ? 0 : "-16px",
                                    }}
                                >
                                    {steps.map((step, index) => (
                                        <Step key={index}>
                                            <StepLabel
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: isSmallScreen ? "column" : "row",
                                                    alignItems: "center",
                                                    justifyContent: isSmallScreen ? "center" : "space-between",
                                                    width: "100%",
                                                    textAlign: isSmallScreen ? "center" : "left",
                                                }}
                                                icon={
                                                    <div
                                                        style={{
                                                            backgroundColor: index === 0 ? "#1976d2" : "#e0e0e0",
                                                            borderRadius: "50%",
                                                            width: "32px",
                                                            height: "32px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            color: "#fff",
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                }
                                            >
                                                <Box sx={{
                                                    border: '2px solid black', // Adds a solid black border
                                                    borderRadius: '8px',
                                                    padding: "10px"
                                                }}>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: "bold",
                                                            color: "#000",
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        {step.label}
                                                    </Typography>
                                                    {!isSmallScreen && (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "rgba(0, 0, 0, 0.6)",
                                                                marginTop: "4px",
                                                                fontSize: "10px"

                                                            }}
                                                        >
                                                            {step.description}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </StepLabel>
                                        </Step>
                                    ))}
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
                                            // defaultValue="1,000"
                                            variant="outlined"
                                            type="number"
                                            value={remittanceAmount}
                                            onChange={(e) => setRemittanceAmount(e.target.value)}
                                            sx={{
                                                background: "var(--bg-clr-1)",
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
                                            background: "var(--bg-clr-1)",
                                            "& .MuiInputBase-input": {
                                                color: "var(--text-color)", // Text color inside
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: "var(--body-text-clr)", // Label color
                                            },
                                        }}>
                                            <InputLabel>Currency</InputLabel>
                                            <Select
                                                defaultValue="INR"
                                                label="Currency" value={currency}
                                                onChange={(e) => setCurrency(e.target.value)}>
                                                <MenuItem value="INR">INR</MenuItem>
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
                                                background: "var(--bg-clr-1)",
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
                                                background: "var(--bg-clr-1)",
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
                                            background: "var(--bg-clr-1)",
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

                                {Object.values(bankDetails).some((value) => value) ? (
                                    <Box
                                        mt={4}
                                        p={2}
                                        sx={{
                                            border: "1px solid black",
                                            borderRadius: "8px",
                                            backgroundColor: "#f9f9f9",
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom>
                                            Bank Details
                                        </Typography>
                                        <Typography variant="body1">
                                            SWIFT Code: {bankDetails.swiftCode}
                                        </Typography>
                                        <Typography variant="body1">
                                            Beneficiary Name: {bankDetails.beneficiaryName}
                                        </Typography>
                                        <Typography variant="body1">
                                            Account Number: {bankDetails.beneficiaryAccountNumber}
                                        </Typography>
                                        <Typography variant="body1">
                                            Routing/Sort Code: {bankDetails.routingNumber}
                                        </Typography>
                                        <Typography variant="body1">
                                            Bank Details:  {bankDetails.beneficiaryBank}, {bankDetails.branch}<br />
                                            {bankDetails.bankAddress}, {bankDetails.city}, {bankDetails.state}, {bankDetails.country}<br />

                                        </Typography>
                                        <Box mt={2} textAlign="center">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => setOpenModal(true)}
                                            >
                                                Edit Bank Details
                                            </Button>
                                        </Box>
                                    </Box>
                                )
                                    :
                                    (
                                        <Box mt={4} textAlign="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleBankDetails}
                                            >
                                                Add Bank Details
                                            </Button>
                                        </Box>
                                    )

                                }

                                <Box mt={4} textAlign="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleTTPaymentDetails}
                                        disabled={isLoading || !Object.values(bankDetails).some((value) => value)} // Disable the button while loading
                                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}

                                    >
                                        Save and Proceed
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                        :
                        <DocumentUploads />
                }

                <BankDetails openModal={openModal} handleCloseModal={handleCloseModal} />
            </div>
        </>
    );
};

export default PaymentDetails;
