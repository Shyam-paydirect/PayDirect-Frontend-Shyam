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
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDispatch } from "react-redux";
import { uploadFiles } from "@/app/redux/slices/api/fileUploadSlice"; // Import the slice action
import { AppDispatch } from "@/app/redux/store";
import { toast, ToastContainer } from "react-toastify";
import { setCurrentDashboard } from "@/app/redux/slices/dashboardSlice";

const DocumentUploads: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const dispa = useDispatch();
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setUploadedFiles((prevFiles) => [...prevFiles, ...filesArray]);
        }
    };

    const handleUploadAll = async () => {
        if (uploadedFiles.length > 0) {
            const custRefId = localStorage.getItem("orderID") || ""; // Ensure custRefId is always a string
            try {
                await dispatch(uploadFiles({ files: uploadedFiles, custRefId }))
                toast.success("Documents uploaded successfully", {
                    onClose: () => {
                        dispa(setCurrentDashboard('order-book'))

                    }
                }

                );
            }
            catch (error) {
                const errorMessage =
                    typeof error === "string"
                        ? error
                        : error instanceof Error
                            ? error.message
                            : "An unknown error occurred";

                toast.error(errorMessage)
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
                                        <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
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
                                                multiple
                                                onChange={handleFileChange}
                                                style={{ display: "none" }}
                                                id={`file-input-${index}`}
                                            />
                                            <label htmlFor={`file-input-${index}`}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    startIcon={<UploadFileIcon />}
                                                    component="span"
                                                    sx={{ width: "100%", marginBottom: 1 }}
                                                >
                                                    Select File
                                                </Button>
                                            </label>
                                        </Box>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {uploadedFiles.length > 0 && (
                        <Box sx={{ marginTop: 3, marginBottom: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                Selected Files:
                            </Typography>
                            <ul>
                                {uploadedFiles.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </Box>
                    )}

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
