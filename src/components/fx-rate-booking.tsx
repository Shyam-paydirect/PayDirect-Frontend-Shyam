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
} from "@mui/material";
import PaymentProgress from "./paymentDetails/payment-progress"; // Import PaymentProgress component
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { RootState } from "@/app/redux/store";
import { fetchFxRate, bookFxRate } from "@/app/redux/slices/api/fxRateSlice"; // Assuming these APIs exist

const FxRateBooker: React.FC = () => {
    const [amount, setAmount] = useState<string>("");
    const [currency, setCurrency] = useState<string>("USD");
    const [fxRate, setFxRate] = useState<number | null>(null);
    const [isLoadingRate, setIsLoadingRate] = useState<boolean>(false);
    const [isBooking, setIsBooking] = useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();
    const selectedOrderId = useSelector(
        (state: RootState) => state.orders.selectedOrderId
    ); // Assuming `selectedOrderId` is in the orders slice

    const handleGetFxRate = async () => {
        if (!amount || !currency) {
            alert("Please fill in all fields.");
            return;
        }
        setIsLoadingRate(true);
        try {
            const response = await dispatch(
                fetchFxRate({ orderId: selectedOrderId, amount, currency })
            ).unwrap();
            setFxRate(response.rate); // Assuming the API response contains `rate`
        } catch (error) {
            console.error("Failed to fetch FX rate:", error);
            alert("Error fetching FX rate.");
        } finally {
            setIsLoadingRate(false);
        }
    };

    const handleBookFxRate = async () => {
        if (!fxRate) {
            alert("Please fetch an FX rate before booking.");
            return;
        }
        setIsBooking(true);
        try {
            await dispatch(
                bookFxRate({ orderId: selectedOrderId, amount, currency, fxRate })
            ).unwrap();
            alert("FX Rate booked successfully!");
        } catch (error) {
            console.error("Failed to book FX rate:", error);
            alert("Error booking FX rate.");
        } finally {
            setIsBooking(false);
        }
    };

    const steps = [
        { label: "Payment Details", description: "Provide remittance details." },
        { label: "Upload Documents", description: "Upload necessary documents." },
        { label: "Get and Book FX Rate", description: "Fetch and confirm rates." },
        { label: "Track Payment", description: "Monitor the payment process." },
    ];

    return (
        <Grid container spacing={4} sx={{ padding: 3 }}>
            {/* Left Section - Payment Progress */}
                <PaymentProgress steps={steps} activeStep={2} />


            {/* Right Section - FX Rate Booker */}
            <Grid item xs={12} md={8}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 3,
                        gap: 4,
                        backgroundColor: "#f4f7fb",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                        Get and Book FX Rate
                    </Typography>

                    {/* Input Section */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Amount"
                                variant="outlined"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter remittance amount"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Currency"
                                variant="outlined"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                placeholder="Enter currency (e.g., USD)"
                            />
                        </Grid>
                    </Grid>

                    {/* Buttons Section */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            justifyContent: "center",
                            width: "100%",
                            marginTop: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGetFxRate}
                            disabled={isLoadingRate || !amount || !currency}
                            sx={{ minWidth: "150px" }}
                        >
                            {isLoadingRate ? <CircularProgress size={24} /> : "Get FX Rate"}
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleBookFxRate}
                            disabled={isBooking || !fxRate}
                            sx={{ minWidth: "150px" }}
                        >
                            {isBooking ? <CircularProgress size={24} /> : "Book FX Rate"}
                        </Button>
                    </Box>

                    {/* Display FX Rate */}
                    {fxRate && (
                        <Card
                            sx={{
                                backgroundColor: "#e8f5e9",
                                padding: 2,
                                marginTop: 2,
                                borderRadius: "8px",
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ color: "#388e3c" }}>
                                    FX Rate: {fxRate.toFixed(4)}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};

export default FxRateBooker;
