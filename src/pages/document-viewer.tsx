import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments, fetchFileData } from '@/app/redux/slices/api/documentSlice';
import { RootState } from '@/app/redux/store';
import { AppDispatch } from '@/app/redux/store';
import DownloadIcon from '@mui/icons-material/Download';
import crypto from 'crypto';

const DocumentViewer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, loading, error } = useSelector((state: RootState) => state.documents);

  const [allApproved, setAllApproved] = useState(false);

  const orderID = localStorage.getItem("orderID") || '';

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

  return (
    <Box sx={{ padding: 4, minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <Typography variant="h4" gutterBottom>
        Documents for Order ID: {orderID}
      </Typography>

      <Stepper activeStep={1} alternativeLabel sx={{ marginBottom: 4 }}>
        {["Payment Details", "Upload Documents", "Accept Rate and Pay", "Track Payment"].map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {loading ? (
        <CircularProgress />
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
              sx={{ padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', background: "rgb(0, 129, 19)" }}
              disabled={!allApproved}
            >
              {"Book FX Rate >"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DocumentViewer;
