import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Paper,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments, fetchFileData } from '@/app/redux/slices/api/documentSlice';
import { RootState } from '@/app/redux/store';
import { AppDispatch } from '@/app/redux/store';
import DownloadIcon from '@mui/icons-material/Download';
import PaymentProgress from "../paymentDetails/payment-progress";
import crypto from 'crypto';
import { selectSelectedOrderId } from '@/app/redux/slices/api/orderSlice';
import { setCurrentDashboard } from '@/app/redux/slices/dashboardSlice';

const DocumentViewer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, loading, error } = useSelector((state: RootState) => state.documents);

  const [allApproved, setAllApproved] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const orderID = useSelector(selectSelectedOrderId) || "";

  const handleNext = () => {
    localStorage.setItem("prev_component", 'document-viewer')
    dispatch(setCurrentDashboard('fx-rate-booker'))
  }

  useEffect(() => {
    dispatch(fetchDocuments(orderID));
  }, [dispatch, orderID]);

  useEffect(() => {
    if (documents && documents.length > 0) {
      setAllApproved(documents.every((doc) => doc.status === 'approved'));
    }
  }, [documents]);

  const decryptUrl = (encryptedUrl: string, encryptionKey: string) => {
    const algorithm = 'aes-256-cbc';
    const [iv, encrypted] = encryptedUrl.split(':');

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  };

  const handleDownloadFile = async (s3Path: string) => {
    const response = await dispatch(fetchFileData(s3Path)).unwrap();
    const file = decryptUrl(response.encryptedUrl, '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    window.open(file, '_blank');
  };

  const steps = [
    { label: "Payment Details", description: "Provide invoice details." },
    { label: "Upload Documents", description: "Upload necessary documents." },
    { label: "Get and Book FX Rate", description: "Fetch and confirm rates." },
    { label: "Track Payment", description: "Monitor the payment process." },
];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row", // Switch between column and row based on screen size
        minHeight: "100vh",
        padding: 4,
        gap: 4,
        backgroundColor: "#f9f9f9",
      }}
    >
      <PaymentProgress steps={steps} activeStep={1} />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#fff",
          padding: 3,
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center", marginBottom: 4 }}>
          Documents for Order ID: {orderID}
        </Typography>

        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "0 auto" }} />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {documents.map((doc) => (
                <Grid item xs={12} sm={6} md={4} key={doc.id}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {doc.doc_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownloadFile(doc.s3_path)}
                    >
                      Download
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ marginTop: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                sx={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: allApproved ? "rgb(0, 129, 19)" : "gray",
                  cursor: allApproved ? "pointer" : "not-allowed",
                }}
                disabled={!allApproved}
                onClick={handleNext}
              >
                {"Book FX Rate >"}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DocumentViewer;
