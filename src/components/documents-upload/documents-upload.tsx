import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Grid,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    CardActions,
    IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { uploadFiles } from "@/app/redux/slices/api/fileUploadSlice"; // Import the slice action
import { AppDispatch } from "@/app/redux/store";
import { toast, ToastContainer } from "react-toastify";
import { setCurrentDashboard } from "@/app/redux/slices/dashboardSlice";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
    username: string;
    id?: number;
}


const DocumentUploads: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const dispa = useDispatch();
    const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File | null }>({});

    const token = Cookies.get('token') || "";

    let decodedToken: CustomJwtPayload | null = null; // Initialize with null

    if (token !== "") {
        decodedToken = jwtDecode<CustomJwtPayload>(token); // Assign the decoded token
    }
    const userId = decodedToken?.id || 0;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFiles((prevFiles) => ({
                ...prevFiles,
                [index]: file,
            }));
        }
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles((prevFiles) => ({
            ...prevFiles,
            [index]: null,
        }));
    };

    const handleUploadAll = async () => {
        const filesToUpload = Object.values(uploadedFiles).filter(Boolean) as File[];

        if (filesToUpload.length > 0) {
            const custRefId =  `${userId}`; 
            try {
                await dispatch(uploadFiles({ files: filesToUpload, custRefId })).unwrap();
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
            description:
                "Please download and fill the request letter for advance payments.",
        },
        {
            title: "Proforma Invoice",
            description:
                "Proforma Invoice of the Supplier/Purchase order duly certified by the applicant.",
        },
        {
            title: "Original Bank Guarantee",
            description:
                "Original Bank Guarantee (applicable in case of advance remittance above USD 200,000 or equivalent).",
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
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 3,
                    gap: 3,
                    maxWidth: "900px",
                    margin: "0 auto",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                    Document Uploads
                </Typography>

                <Stepper activeStep={1} alternativeLabel sx={{ width: "100%" }}>
                    {["Payment Details", "Upload Documents", "Accept Rate and Pay", "Track Payment"].map(
                        (label, index) => (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        )
                    )}
                </Stepper>

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
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, index)}
                                                style={{ display: "none" }}
                                                id={`file-input-${index}`}
                                            />
                                            <label htmlFor={`file-input-${index}`}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    component="span"
                                                    sx={{ width: "100%", marginBottom: 1 }}
                                                >
                                                    <UploadFileIcon />
                                                    Select File
                                                </Button>
                                            </label>
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
                                                            '&:hover': {
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
        </>
    );
};

export default DocumentUploads;
