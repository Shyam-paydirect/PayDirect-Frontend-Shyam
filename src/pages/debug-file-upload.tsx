import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Button, Alert } from '@mui/material';
import FileValidator from '../components/Receivables/FileValidator';
import FileUploadTest from '../components/Receivables/FileUploadTest';
import APITest from '../components/Receivables/APITest';
import CurlTest from '../components/Receivables/CurlTest';
import FileDiagnostic from '../components/Receivables/FileDiagnostic';
import ServerStatusChecker from '../components/Receivables/ServerStatusChecker';

const DebugFileUploadPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('server-status');

  const tabs = [
    { id: 'server-status', label: 'Server Status', component: <ServerStatusChecker /> },
    { id: 'diagnostic', label: 'File Diagnostic', component: <FileDiagnostic /> },
    { id: 'validator', label: 'File Validator', component: <FileValidator /> },
    { id: 'upload-test', label: 'Upload Test', component: <FileUploadTest /> },
    { id: 'api-test', label: 'API Test', component: <APITest /> },
    { id: 'curl-test', label: 'cURL Test', component: <CurlTest /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        File Upload Debug Center
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Use these tools to debug file upload issues. Start with the File Validator to check your file,
        then use the Upload Test to try uploading it.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Debugging Steps:</strong>
        </Typography>
        <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Use <strong>Server Status</strong> to check if the API server is reachable</li>
          <li>Use <strong>File Diagnostic</strong> to analyze your file and identify issues</li>
          <li>Use <strong>File Validator</strong> to check if your file is valid</li>
          <li>Use <strong>Upload Test</strong> to test the actual upload</li>
          <li>Use <strong>API Test</strong> to test the API directly</li>
          <li>Use <strong>cURL Test</strong> to see working examples</li>
        </ol>
      </Alert>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'contained' : 'outlined'}
              onClick={() => setActiveTab(tab.id)}
              sx={{ mb: -1 }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Tab Content */}
      <Box>
        {tabs.find(tab => tab.id === activeTab)?.component}
      </Box>

      {/* Additional Help */}
      <Paper sx={{ p: 3, mt: 4, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          Common Issues and Solutions
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              ❌ Common Issues
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>Server is down or unreachable</li>
              <li>File extension doesn't match MIME type</li>
              <li>File is corrupted or invalid</li>
              <li>File size is 0 bytes or too large</li>
            </ul>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              ✅ Solutions
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>Check server status first</li>
              <li>Rename file to match its actual type</li>
              <li>Try with a different file</li>
              <li>Check file size (must be &gt; 0 and &lt; 10MB)</li>
            </ul>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              🔧 API Requirements
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>Only PDF, JPEG, PNG files</li>
              <li>Purpose: finance_document</li>
              <li>Max size: 10MB</li>
              <li>Extension must match MIME type</li>
            </ul>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DebugFileUploadPage;
