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

const TrackPayments: React.FC = () => {
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
                justifyContent: 'space-between'
            }}
        >
            <PaymentProgress steps={steps} activeStep={3} />
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 350"
                    width="300"
                    height="350"
                    aria-label="Payment Successfully Generated"
                >
                    {/* Gradient Definitions */}
                    <defs>
                        <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#e0f7fa" />
                            <stop offset="100%" stopColor="#80d8ff" />
                        </radialGradient>

                        <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#43a047" />
                            <stop offset="100%" stopColor="#81c784" />
                        </linearGradient>

                        <radialGradient id="currencyGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ffd54f" />
                            <stop offset="100%" stopColor="#ffab40" />
                        </radialGradient>

                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="8" stdDeviation="4" floodColor="#00000022" />
                        </filter>
                    </defs>

                    {/* Background Circle */}
                    <circle cx="150" cy="150" r="150" fill="url(#backgroundGradient)" />

                    {/* Inner White Circle */}
                    <circle cx="150" cy="150" r="110" fill="#ffffff" />

                    {/* Checkmark */}
                    <path
                        d="M100 150l30 30 60-60"
                        stroke="url(#checkGradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#shadow)"
                    />

                    {/* Currency Icons */}
                    <g>
                        {/* Dollar Icon */}
                        <circle cx="240" cy="90" r="18" fill="url(#currencyGradient)" />
                        <text
                            x="240"
                            y="97"
                            fontSize="14"
                            fontWeight="bold"
                            textAnchor="middle"
                            fill="#ffffff"
                        >
                            $
                        </text>

                        {/* Euro Icon */}
                        <circle cx="60" cy="90" r="18" fill="#9fa8da" />
                        <text
                            x="60"
                            y="97"
                            fontSize="14"
                            fontWeight="bold"
                            textAnchor="middle"
                            fill="#ffffff"
                        >
                            €
                        </text>

                        {/* Pound Icon */}
                        <circle cx="240" cy="210" r="18" fill="#ffab91" />
                        <text
                            x="240"
                            y="217"
                            fontSize="14"
                            fontWeight="bold"
                            textAnchor="middle"
                            fill="#ffffff"
                        >
                            £
                        </text>

                        {/* Yen Icon */}
                        <circle cx="60" cy="210" r="18" fill="#aed581" />
                        <text
                            x="60"
                            y="217"
                            fontSize="14"
                            fontWeight="bold"
                            textAnchor="middle"
                            fill="#ffffff"
                        >
                            ¥
                        </text>
                    </g>

                    {/* Success Text */}
                    <text
                        x="50%"
                        y="320"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="bold"
                        fill="#388e3c"
                    >
                        Payment Successfully Generated
                    </text>
                    <text
                        x="50%"
                        y="340"
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="normal"
                        fill="#555555"
                    >
                        You will be notified about the payment progress.
                    </text>
                </svg>
            </div>
            <div>
                
            </div>
            {/* <CurrencyExchanger book={true} /> */}
        </Box>


    );
};

export default TrackPayments;
