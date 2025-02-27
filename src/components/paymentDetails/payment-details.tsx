import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    useMediaQuery,
    useTheme,
    Button,
    CircularProgress,
} from "@mui/material";
import './payment-details.css';
import { useDispatch, useSelector } from "react-redux";
import DocumentUploads from "../documents-upload/documents-upload";
import { saveBankDetails, savePaymentDetails } from '@/app/redux/slices/paymentDetailsSlice';
import BankDetails from "./bank-details";
import { RootState } from "@/app/redux/store";
import { AppDispatch } from '@/app/redux/store';
import { toast, ToastContainer } from "react-toastify";
import { setCurrentDashboard } from "@/app/redux/slices/dashboardSlice";
import OTPDialog from "./otp-dialog";
import { fetchUserDetails, sendOtp } from "@/app/redux/slices/api/txnOtpSlice";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { submitPayment } from "@/app/redux/slices/api/ttPaymentSlice";
import { createOrder, fetchAllOrders, CreateOrderRequest, selectOrderState } from '@/app/redux/slices/api/orderSlice';
import moment from "moment";
import PaymentProgress from "./payment-progress";
import { setSelectedOrderId } from '@/app/redux/slices/api/orderSlice';

interface CustomJwtPayload {
    username: string;
    id?: number;
}

const PaymentDetails: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [otpTransactionId, setOtpTransactionId] = useState<string>("");

    const [remittanceAmount, setRemittanceAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [dateOfTransfer, setDateOfTransfer] = useState(moment().format("YYYY-MM-DD"));
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [purposeCode, setPurposeCode] = useState('');
    const [customerReference, setCustomerReference] = useState("");
    const [errors, setErrors] = useState({
        remittanceAmount: false,
        dateOfTransfer: false,
        invoiceNumber: false,
        purposeCode: false,
    });

    const token = Cookies.get('token') || "";

    let decodedToken: CustomJwtPayload | null = null; // Initialize with null

    if (token !== "") {
        decodedToken = jwtDecode<CustomJwtPayload>(token); // Assign the decoded token
    }
    const userId = decodedToken?.id || 0;

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [openModal, setOpenModal] = useState(false);
    const [step, setStep] = useState<"bankDetails" | "documentUploads">("bankDetails");

    useEffect(() => {
        const number = generateRandom11DigitNumber();
        setCustomerReference("TT" + number);
    }, []);

    const bankDetails = useSelector((state: RootState) => state.paymentDetails.bankDetails);

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

    const handleTTPaymentDetails = async () => {
        if (!validateFields()) {
            toast.error("Please fill out all required fields.");
            return;
        }

        setIsLoading(true);

        try {
            const phoneNumber = ""; // Placeholder for phone number

            const userData = await dispatch(fetchUserDetails(userId)).unwrap();
            const email = userData?.user_data?.email; // Replace with dynamic data
            await dispatch(sendOtp({
                transactionId: customerReference,
                userId: String(userId),
                phoneNumber,
                email,
            })).unwrap();

            toast.info("OTP sent to your registered email.");
            setOtpTransactionId(customerReference);
            dispatch(setSelectedOrderId(customerReference));

            setIsDialogOpen(true);
        } catch (error) {
            const errorMessage =
                typeof error === "string"
                    ? error
                    : error instanceof Error
                        ? error.message
                        : "An unknown error occurred";
            toast.error(errorMessage);
        }
    };


    const paymentData = {
        txnAmount: remittanceAmount,
        customerReference: customerReference,
        txnCcy: currency,
        debitAccountAmount: remittanceAmount,
        purposeOfPayment: purposeCode,
        chargeBearer: "DEBT",
        senderParty: {
            name: bankDetails.senderName,
            accountNo: bankDetails.senderAccNo,
            swiftBic: bankDetails.senderBic,
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

    const handleNextStep = () => {
        localStorage.setItem("prev_component", 'payment-details')
        dispatch(setCurrentDashboard('document-uploads'));
    }

    const handleConfirmOTP = async () => {
        setIsDialogOpen(false);

        setIsLoading(true);

        try {
            const response = await dispatch(submitPayment(paymentData)).unwrap();
            const orderData: CreateOrderRequest = {
                userId: userId,
                txnAmount: remittanceAmount,
                statusPayment: '1',
                orderId: customerReference,
                msgId: response?.data?.header?.msgId,
                orgId: response?.data?.header?.orgId,
                timeStamp: response?.data?.header?.timeStamp,
                paymentMode: 'TT',
                responseType: response?.data?.txnResponses[0]?.responseType,
                txnStatus: response?.data?.txnResponses[0]?.txnStatus,
                txnStatusDescription: response?.data?.txnResponses[0]?.txnStatusDescription,
                sendingPartyName: "Articulus Surgery",
                sendingPartyAccountNo: "8151210000004565",
                receivingPartyName: bankDetails.beneficiaryName,
                receivingPartyAccountNo: bankDetails.beneficiaryAccountNumber
            }
            await handleOrderCreation(orderData);
            localStorage.setItem('txnAmount', remittanceAmount);
            localStorage.setItem('currency', currency);
            toast.success("TT Payment Initiated")

            setTimeout(() => {
                handleNextStep();

            }, 2000)


            setIsLoading(false); // Reset loading state
            setCustomerReference("");
            setRemittanceAmount('');
            setCurrency('INR');
            setDateOfTransfer('2025-01-01');
            setInvoiceNumber('');
            setPurposeCode('');
            const initialBankData = {
                swiftCode: '',
                beneficiaryBank: '',
                branch: '',
                bankAddress: '',
                city: '',
                state: '',
                country: '',
                beneficiaryName: '',
                beneficiaryAccountNumber: '',
                micrCode: '',
                senderName: '',
                senderAccNo: '',
                senderBic: ''
            };
            dispatch(saveBankDetails(initialBankData));


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
            setIsLoading(false); // Reset loading state
        }
    };

    const handleOrderCreation = async (orderData: CreateOrderRequest) => {

        try {
            const response = await dispatch(createOrder(orderData)).unwrap();

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
        }
    }

    const steps = [
        { label: "Payment Details", description: "Provide remittance details." },
        { label: "Upload Documents", description: "Upload necessary documents." },
        { label: "Get and Book FX Rate", description: "Fetch and confirm rates." },
        { label: "Track Payment", description: "Monitor the payment process." },
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

        dispatch(savePaymentDetails(paymentDetails));
    };

    const handleCloseModal = () => setOpenModal(false);

    return (
        <>
            <ToastContainer />
            <div className='payment-details-parent'>
                {step === "bankDetails" ? (
                    <Box
                        display="flex"
                        flexDirection={isSmallScreen ? "column" : "row"}
                        borderRadius="8px"
                        overflow="hidden"
                        boxShadow={2}
                        bgcolor='var(--bg-clr-1)'
                        width="100%"
                    >
                        <PaymentProgress steps={steps} activeStep={0} />

                        <Box flexGrow={1} p={3}>
                            <Typography variant="h6" gutterBottom>
                                Payment Details
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Remittance Amount"
                                        variant="outlined"
                                        type="number"
                                        value={remittanceAmount}
                                        onChange={(e) => setRemittanceAmount(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined" sx={{ marginTop: 0 }}>
                                        <InputLabel>Currency</InputLabel>
                                        <Select
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            label="Currency"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    padding: "16.5px 14px", // Matches TextField padding
                                                },
                                            }}
                                        >
                                            <MenuItem value="INR">INR</MenuItem>
                                            <MenuItem value="USD">USD</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>



                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Date of Transfer"
                                        type="date"
                                        value={dateOfTransfer}
                                        onChange={(e) => setDateOfTransfer(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Invoice Number"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" sx={{ marginTop: 0 }}>
                                        <InputLabel>Purpose Code</InputLabel>
                                        <Select
                                            value={purposeCode}
                                            onChange={(e) => setPurposeCode(e.target.value)}
                                            label="Purpose Code"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    padding: "16.5px 14px", // Matches TextField padding
                                                },
                                            }}
                                        >
                                            <MenuItem value="S0101">S0101 Advance payment against imports</MenuItem>
                                            <MenuItem value="S0102">S0102 Payment towards imports - settlement of invoice</MenuItem>
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
                                        Bank Address: {bankDetails.bankAddress}
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
                            ) : (
                                <Box mt={4} textAlign="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleBankDetails}
                                    >
                                        Add Bank Details
                                    </Button>
                                </Box>
                            )}

                            <Box mt={4} textAlign="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleTTPaymentDetails}
                                    disabled={isLoading || !Object.values(bankDetails).some((value) => value)}
                                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                                >
                                    Save and Proceed
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <DocumentUploads />
                )}

                <BankDetails openModal={openModal} handleCloseModal={handleCloseModal} />
                <OTPDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    transactionId={otpTransactionId}
                    onConfirm={handleConfirmOTP}
                />
            </div>
        </>
    );
};

export default PaymentDetails;
