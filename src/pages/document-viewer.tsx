import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Paper,
  Divider,
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

  const orderID = localStorage.getItem("orderID") || '';

  useEffect(() => {
    dispatch(fetchDocuments(orderID));

  }, [dispatch, orderID]);
  
  console.log("documents", documents);
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
    // console.log("responseee", response.encryptedUrl);

    
    const file = decryptUrl(response.encryptedUrl, '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
    window.open(file, '_blank');
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', s3Path.split('/').pop() || 'file');
    // document.body.appendChild(link);
    // link.click();
    // link.parentNode?.removeChild(link);
  };

  return (
    <Box sx={{ padding: 4, minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <Typography variant="h4" gutterBottom>
        Documents for Order ID: {orderID}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {documents.map((doc) => (
            <Grid item xs={12} sm={6} md={4} key={doc.id}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {doc.doc_name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {doc.status}
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
      )}
    </Box>
  );
};

export default DocumentViewer;
