import React from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    Stepper,
    Step,
    StepLabel,
    useMediaQuery,
    useTheme,
} from "@mui/material";

const DocumentUploads: React.FC = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Box
            display="flex"
            flexDirection={ "column" }
            borderRadius="8px"
            overflow="hidden"
            boxShadow={2}
            bgcolor="#fff"
            width="100%"
            maxWidth="900px"
        >
            {/* Sidebar */}
            <Box
                width={"100%"}
                bgcolor="#f4f4f4"
                p={3}
                display="flex"
                flexDirection="column"
                alignItems={"center" }
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
                    orientation={"horizontal"}
                    activeStep={1}
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
                                        },
                                        ".MuiStepIcon-root": {
                                            fontSize: "24px", // Adjust icon size if needed
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
            {/* Header Section */}
            <Box sx={{padding: 3}}>
                <Typography variant="h6" sx={{ fontSize: "18px", fontWeight: "bold" }}>
                    Upload Documents
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", marginTop: "8px" }}>
                    Please upload the required documents to initiate the transaction.
                </Typography>
            </Box>

            {/* Document Uploads Section */}
            <Box  sx={{padding:3}}>
                <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}
                >
                    Transaction Documents Required
                </Typography>

                <Grid container spacing={3}>
                    {[
                        {
                            title: "Request Letter for Advance Import Payments",
                            description:
                                "Please download and fill the request letter for advance payments.",
                            buttonText: "Upload",
                            link: "Download format",
                        },
                        {
                            title: "Proforma Invoice",
                            description:
                                "Proforma Invoice of the Supplier/Purchase order duly certified by the applicant.",
                            buttonText: "Upload",
                        },
                        {
                            title: "Original Bank Guarantee",
                            description:
                                "Original Bank Guarantee (applicable in case of advance remittance above USD 200,000 or equivalent).",
                            buttonText: "Upload",
                        },
                        {
                            title: "Others",
                            description: "Upload any other document if required.",
                            buttonText: "Upload",
                        },
                    ].map((doc, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Paper
                                variant="outlined"
                                sx={{ padding: "16px", borderRadius: "8px", height: "100%" }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontSize: "14px", fontWeight: "bold" }}
                                >
                                    {doc.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary", marginTop: "8px" }}
                                >
                                    {doc.description}
                                </Typography>
                                {doc.link && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "primary.main",
                                            marginTop: "8px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {doc.link}
                                    </Typography>
                                )}
                                <Box mt={2} textAlign="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ fontSize: "12px" }}
                                    >
                                        {doc.buttonText}
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Submit Section */}
            <Box textAlign="center" mt={4} mb= {6}>
                <Button
                    variant="contained"
                    color="success"
                    size="large"
                    sx={{ borderRadius: "8px" }}
                >
                    Submit for Verification
                </Button>
            </Box>
        </Box>
    );
};

export default DocumentUploads;
