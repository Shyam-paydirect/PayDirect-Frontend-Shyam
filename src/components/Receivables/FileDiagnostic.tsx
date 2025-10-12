import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, List, ListItem, ListItemText, Chip } from '@mui/material';
import { CloudUpload, CheckCircle, Error, Warning } from '@mui/icons-material';

const FileDiagnostic: React.FC = () => {
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const info = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      extension: file.name.split('.').pop()?.toLowerCase(),
    };

    setFileInfo(info);

    // Run comprehensive diagnostics
    const diag = {
      // Basic checks
      hasName: file.name.length > 0,
      hasSize: file.size > 0,
      sizeValid: file.size <= 10 * 1024 * 1024, // 10MB
      
      // Type checks
      hasType: file.type.length > 0,
      typeSupported: ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type),
      
      // Extension checks
      hasExtension: file.name.includes('.'),
      extensionSupported: ['jpg', 'jpeg', 'png', 'pdf'].includes(file.name.split('.').pop()?.toLowerCase() || ''),
      
      // MIME type vs extension matching
      extensionMatchesType: false,
      
      // Specific issues
      issues: [] as string[],
      warnings: [] as string[],
      recommendations: [] as string[]
    };

    // Check extension vs MIME type matching
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf' && file.type === 'application/pdf') {
      diag.extensionMatchesType = true;
    } else if (['jpg', 'jpeg'].includes(extension || '') && file.type === 'image/jpeg') {
      diag.extensionMatchesType = true;
    } else if (extension === 'png' && file.type === 'image/png') {
      diag.extensionMatchesType = true;
    }

    // Identify issues
    if (!diag.hasName) diag.issues.push('File has no name');
    if (!diag.hasSize) diag.issues.push('File is empty (0 bytes)');
    if (!diag.sizeValid) diag.issues.push('File is too large (>10MB)');
    if (!diag.hasType) diag.issues.push('File has no MIME type');
    if (!diag.typeSupported) diag.issues.push(`MIME type '${file.type}' is not supported`);
    if (!diag.hasExtension) diag.issues.push('File has no extension');
    if (!diag.extensionSupported) diag.issues.push(`Extension '.${extension}' is not supported`);
    if (!diag.extensionMatchesType) diag.issues.push('File extension does not match MIME type');

    // Add warnings
    if (file.size < 100) diag.warnings.push('File is very small, might be corrupted');
    if (file.type === 'application/octet-stream') diag.warnings.push('File type is generic binary, might not be recognized correctly');

    // Add recommendations
    if (diag.issues.length === 0) {
      diag.recommendations.push('File appears to be valid for upload');
    } else {
      if (!diag.typeSupported) {
        diag.recommendations.push('Try converting the file to PDF, JPEG, or PNG format');
      }
      if (!diag.extensionMatchesType) {
        diag.recommendations.push('Rename the file to match its actual type (e.g., rename .txt to .pdf if it\'s actually a PDF)');
      }
      if (file.size === 0) {
        diag.recommendations.push('The file appears to be empty, try with a different file');
      }
      if (file.size > 10 * 1024 * 1024) {
        diag.recommendations.push('Compress the file or use a smaller version');
      }
    }

    setDiagnostics(diag);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSeverity = () => {
    if (!diagnostics) return 'info';
    if (diagnostics.issues.length === 0) return 'success';
    if (diagnostics.issues.length <= 2) return 'warning';
    return 'error';
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        File Diagnostic Tool
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        This tool will analyze your file and identify any issues that might cause upload failures.
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <input
          type="file"
          id="file-diagnostic"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-diagnostic">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUpload />}
            sx={{ mb: 2 }}
          >
            Select File for Diagnosis
          </Button>
        </label>
      </Box>

      {fileInfo && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            File Information:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label={`Name: ${fileInfo.name}`} variant="outlined" />
            <Chip label={`Size: ${formatFileSize(fileInfo.size)}`} variant="outlined" />
            <Chip label={`Type: ${fileInfo.type}`} variant="outlined" />
            <Chip label={`Extension: .${fileInfo.extension}`} variant="outlined" />
          </Box>
        </Box>
      )}

      {diagnostics && (
        <Box>
          <Alert severity={getSeverity()} sx={{ mb: 2 }}>
            <Typography variant="h6">
              {diagnostics.issues.length === 0 ? '✅ File is Ready for Upload' : '❌ File has Issues'}
            </Typography>
            {diagnostics.issues.length === 0 && (
              <Typography variant="body2">
                Your file appears to be valid and should upload successfully.
              </Typography>
            )}
          </Alert>

          {diagnostics.issues.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Issues Found:
              </Typography>
              <List dense>
                {diagnostics.issues.map((issue: string, index: number) => (
                  <ListItem key={index}>
                    <Error color="error" sx={{ mr: 1 }} />
                    <ListItemText primary={issue} />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}

          {diagnostics.warnings.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Warnings:
              </Typography>
              <List dense>
                {diagnostics.warnings.map((warning: string, index: number) => (
                  <ListItem key={index}>
                    <Warning color="warning" sx={{ mr: 1 }} />
                    <ListItemText primary={warning} />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}

          {diagnostics.recommendations.length > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Recommendations:
              </Typography>
              <List dense>
                {diagnostics.recommendations.map((rec: string, index: number) => (
                  <ListItem key={index}>
                    <CheckCircle color="info" sx={{ mr: 1 }} />
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}
        </Box>
      )}

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>API Requirements:</strong> Only PDF, JPEG, and PNG files under 10MB are accepted. 
          The file extension must match the MIME type exactly.
        </Typography>
      </Alert>
    </Paper>
  );
};

export default FileDiagnostic;

