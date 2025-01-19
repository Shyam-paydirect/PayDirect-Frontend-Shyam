import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { uploadFiles } from "@/app/redux/slices/api/fileUploadSlice"; // Import the slice action
import { AppDispatch } from "@/app/redux/store";
import { toast, ToastContainer } from "react-toastify";
import { setCurrentDashboard } from "@/app/redux/slices/dashboardSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import PaymentProgress from "../paymentDetails/payment-progress"; // Import the PaymentProgress component

interface CustomJwtPayload {
    username: string;
    id?: number;
}

const DocumentUploads: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const dispa = useDispatch();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File | null }>({});

    const token = Cookies.get("token") || "";

    let decodedToken: CustomJwtPayload | null = null;

    if (token !== "") {
        decodedToken = jwtDecode<CustomJwtPayload>(token);
    }
    const userId = decodedToken?.id || 0;

    const handleFileChange = (index: number) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "*";
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                setUploadedFiles((prevFiles) => ({
                    ...prevFiles,
                    [index]: file,
                }));
            }
        };
        input.click();
    };

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

    const handleRemoveFile = (index: number) => {
        setUploadedFiles((prevFiles) => ({
            ...prevFiles,
            [index]: null,
        }));
    };

    const handleUploadAll = async () => {
        const filesToUpload = Object.values(uploadedFiles).filter(Boolean) as File[];

        if (filesToUpload.length > 0) {
            const custRefId = localStorage.getItem("orderID") || "";
            const customerId = `${userId}`;
            try {
                await dispatch(uploadFiles({ files: filesToUpload, custRefId, customerId })).unwrap();
                toast.success("Documents uploaded successfully", {
                    onClose: () => {
                        dispa(setCurrentDashboard("order-book"));
                    },
                });
            } catch (error) {
                const errorMessage =
                    typeof error === "string"
                        ? error
                        : error instanceof Error
                        ? error.message
                        : "An unknown error occurred";

                toast.error(errorMessage);
            }
        } else {
            alert("Please select files first.");
        }
    };

    const documents = [
        {
            title: "Request Letter for Advance Import Payments",
            description: "Please download and fill the request letter for advance payments.",
        },
        {
            title: "Proforma Invoice",
            description: "Proforma Invoice of the Supplier/Purchase order duly certified by the applicant.",
        },
        {
            title: "Original Bank Guarantee",
            description: "Original Bank Guarantee (applicable in case of advance remittance above USD 200,000 or equivalent).",
        },
        {
            title: "Others",
            description: "Upload any other document if required.",
        },
    ];

    return (
        <>
            <ToastContainer />
            {/* Adjust the layout based on screen size */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isSmallScreen ? "column" : "row", // Change direction for small screens
                    gap: 3,
                    alignItems: isSmallScreen ? "center" : "flex-start", // Align items for vertical layout
                    width: "100%",
                    padding: 3,
                    backgroundColor: "#f0f4ff",
                }}
            >
                {/* <Box
                    sx={{
                        width: isSmallScreen ? "100%" : "30%", // Adjust width for small screens
                        minWidth: "250px",
                        backgroundColor: "white",
                        padding: 2,
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                > */}
                    <PaymentProgress steps={steps} activeStep={1} />
                {/* </Box> */}

                <Box
                    sx={{
                        flex: 1,
                        backgroundColor: "white",
                        padding: 3,
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                        Document Uploads
                    </Typography>

                    <Box sx={{ width: "100%", marginTop: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                            Transaction Documents Required
                        </Typography>

                        <Grid container spacing={3}>
                            {documents.map((doc, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            padding: 2,
                                        }}
                                    >
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: "bold" }}
                                                gutterBottom
                                            >
                                                {doc.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {doc.description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Box display="flex" flexDirection="column" width="100%">
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleFileChange(index)}
                                                    sx={{ width: "100%", marginBottom: 1 }}
                                                >
                                                    <UploadFileIcon />
                                                    Select File
                                                </Button>
                                                {uploadedFiles[index] && (
                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                        sx={{
                                                            border: "1px solid #ddd",
                                                            borderRadius: "8px",
                                                            padding: "8px 12px",
                                                            marginTop: 1,
                                                        }}
                                                    >
                                                        <Typography variant="body2">
                                                            {uploadedFiles[index]?.name}
                                                        </Typography>
                                                        <IconButton
                                                            onClick={() => handleRemoveFile(index)}
                                                            color="error"
                                                            size="small"
                                                            sx={{
                                                                borderRadius: "50%",
                                                                backgroundColor: "rgba(255,0,0,0.1)",
                                                                "&:hover": {
                                                                    backgroundColor: "rgba(255,0,0,0.2)",
                                                                },
                                                            }}
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </Box>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleUploadAll}
                            sx={{ width: "100%", marginTop: 2 }}
                        >
                            Upload All Files
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default DocumentUploads;
