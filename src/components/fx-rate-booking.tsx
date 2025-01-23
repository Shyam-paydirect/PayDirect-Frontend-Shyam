import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    useMediaQuery,
    useTheme
} from "@mui/material";
import PaymentProgress from "./paymentDetails/payment-progress"; // Import PaymentProgress component
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { RootState } from "@/app/redux/store";
import { fetchFxRate, bookFxRate } from "@/app/redux/slices/api/fxRateSlice"; // Assuming these APIs exist
import CurrencyExchanger from "./currencyManagement/currency-exchanger/currency-exchanger";

const FxRateBooker: React.FC = () => {
    const [amount, setAmount] = useState<string>("");
    const [currency, setCurrency] = useState<string>("USD");
    const [fxRate, setFxRate] = useState<number | null>(null);
    const [isLoadingRate, setIsLoadingRate] = useState<boolean>(false);
    const [isBooking, setIsBooking] = useState<boolean>(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    
    const dispatch = useDispatch<AppDispatch>();
    const selectedOrderId = useSelector(
        (state: RootState) => state.orders.selectedOrderId
    ); // Assuming `selectedOrderId` is in the orders slice

    const steps = [
        { label: "Payment Details", description: "Provide remittance details." },
        { label: "Upload Documents", description: "Upload necessary documents." },
        { label: "Get and Book FX Rate", description: "Fetch and confirm rates." },
        { label: "Track Payment", description: "Monitor the payment process." },
    ];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row", // Stack on small screens
                minHeight: "100%",
                padding: 4,
                gap: 4,
            }}
        >
            <PaymentProgress steps={steps} activeStep={2} />
           
            <CurrencyExchanger book={true} />
        </Box>


    );
};

export default FxRateBooker;
