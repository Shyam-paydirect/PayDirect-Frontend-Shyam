import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { uploadFiles } from "@/app/redux/slices/api/fileUploadSlice";
import { fetchDocuments } from "@/app/redux/slices/api/documentSlice";
import { AppDispatch } from "@/app/redux/store";
import { toast, ToastContainer } from "react-toastify";
import { setCurrentDashboard } from "@/app/redux/slices/dashboardSlice";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import PaymentProgress from "../paymentDetails/payment-progress";
import { selectSelectedOrderId, updateOrderPaymentStatus } from "@/app/redux/slices/api/orderSlice";

interface CustomJwtPayload {
    username: string;
    id?: number;
}

const DocumentUploads: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const currOrderId = useSelector(selectSelectedOrderId);

    const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File[] }>({});
    const [preUploadedDocs, setPreUploadedDocs] = useState<{ [key: number]: any[] }>({});
    const token = Cookies.get("token") || "";

    let decodedToken: CustomJwtPayload | null = null;

    if (token !== "") {
        decodedToken = jwtDecode<CustomJwtPayload>(token);
    }
    const userId = decodedToken?.id || 0;

    useEffect(() => {
        const fetchUploadedDocs = async () => {
            if (!currOrderId) return;
            try {
                const response = await dispatch(fetchDocuments(currOrderId)).unwrap();
                const fetchedDocs = response.allDocs || [];

                const mappedDocs: { [key: number]: any[] } = {};
                fetchedDocs.forEach((doc: any, index: number) => {
                    const mapIndex = index < 3 ? index : 3;
                    if (!mappedDocs[mapIndex]) mappedDocs[mapIndex] = [];
                    mappedDocs[mapIndex].push(doc);
                });

                setPreUploadedDocs(mappedDocs);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };

        fetchUploadedDocs();
    }, [dispatch, currOrderId]);

    const handleFileChange = (index: number) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "*";
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                setUploadedFiles((prevFiles) => ({
                    ...prevFiles,
                    [index]: [...(prevFiles[index] || []), file],
                }));
            }
        };
        input.click();
    };

    const handleRemoveFile = (index: number, fileIndex: number) => {
        setUploadedFiles((prevFiles) => ({
            ...prevFiles,
            [index]: prevFiles[index].filter((_, i) => i !== fileIndex),
        }));
    };

    const handleUploadAll = async () => {
        const filesToUpload = Object.entries(uploadedFiles)
            .flatMap(([index, files]) => files)
            .filter(Boolean);

        if (filesToUpload.length > 0) {
            const custRefId = currOrderId || "";
            const customerId = `${userId}`;
            try {
                await dispatch(uploadFiles({ files: filesToUpload, custRefId, customerId })).unwrap();
                toast.success("Documents uploaded successfully");
                setTimeout(() => {
                    localStorage.setItem("prev_component", "document-uploads");
                    dispatch(setCurrentDashboard("document-viewer"));
                    dispatch(updateOrderPaymentStatus({
                        orderId: custRefId,
                        statusPayment: '2'
                    }))
                }, 2000);
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

    const steps = [
        { label: "Payment Details", description: "Provide remittance details." },
        { label: "Upload Documents", description: "Upload necessary documents." },
        { label: "Get and Book FX Rate", description: "Fetch and confirm rates." },
        { label: "Track Payment", description: "Monitor the payment process." },
    ];

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
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isSmallScreen ? "column" : "row",
                    gap: 3,
                    alignItems: isSmallScreen ? "center" : "flex-start",
                    width: "100%",
                    padding: 3,
                    backgroundColor: "#f0f4ff",
                }}
            >
                <PaymentProgress steps={steps} activeStep={1} />
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
                                        <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
                                            {doc.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {doc.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Box width="100%">
                                            {preUploadedDocs[index]?.map((file, idx) => (
                                                <Box
                                                    key={idx}
                                                    sx={{
                                                        border: "1px solid #ddd",
                                                        borderRadius: "8px",
                                                        padding: "8px 12px",
                                                        marginBottom: 1,
                                                        backgroundColor: "#f9f9f9",
                                                    }}
                                                >
                                                    <Typography variant="body2">{file.doc_name}</Typography>
                                                </Box>
                                            ))}
                                            {uploadedFiles[index]?.map((file, idx) => (
                                                <Box
                                                    key={idx}
                                                    sx={{
                                                        border: "1px solid #ddd",
                                                        borderRadius: "8px",
                                                        padding: "8px 12px",
                                                        marginBottom: 1,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        backgroundColor: "#f9f9f9",
                                                    }}
                                                >
                                                    <Typography variant="body2">{file.name}</Typography>
                                                    <IconButton
                                                        onClick={() => handleRemoveFile(index, idx)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                            {index === 3 && ((preUploadedDocs[index]?.length || 0) + (uploadedFiles[index]?.length || 0)) < 2 && (
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleFileChange(index)}
                                                    fullWidth
                                                    sx={{ marginBottom: 1 }}
                                                >
                                                    <UploadFileIcon />
                                                    Select File
                                                </Button>
                                            )}
                                            {index < 3 &&
                                                !preUploadedDocs[index]?.length &&
                                                uploadedFiles[index]?.length !== 1 && (
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => handleFileChange(index)}
                                                        fullWidth
                                                    >
                                                        <UploadFileIcon />
                                                        Select File
                                                    </Button>
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
        </>
    );
};

export default DocumentUploads;
