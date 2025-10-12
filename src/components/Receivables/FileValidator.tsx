import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, List, ListItem, ListItemText } from '@mui/material';
import { CloudUpload, CheckCircle, Error } from '@mui/icons-material';

const FileValidator: React.FC = () => {
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [validationResults, setValidationResults] = useState<any>(null);

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

    // Validate the file
    const results = {
      hasValidName: file.name.length > 0,
      hasValidSize: file.size > 0 && file.size <= 10 * 1024 * 1024, // 10MB
      hasValidType: ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type),
      hasValidExtension: ['jpg', 'jpeg', 'png', 'pdf'].includes(file.name.split('.').pop()?.toLowerCase() || ''),
      extensionMatchesType: false,
      overallValid: false
    };

    // Check if extension matches MIME type
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf' && file.type === 'application/pdf') {
      results.extensionMatchesType = true;
    } else if (['jpg', 'jpeg'].includes(extension || '') && file.type === 'image/jpeg') {
      results.extensionMatchesType = true;
    } else if (extension === 'png' && file.type === 'image/png') {
      results.extensionMatchesType = true;
    }

    results.overallValid = results.hasValidName && 
                          results.hasValidSize && 
                          results.hasValidType && 
                          results.hasValidExtension && 
                          results.extensionMatchesType;

    setValidationResults(results);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        File Validator
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <input
          type="file"
          id="file-validator"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-validator">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUpload />}
            sx={{ mb: 2 }}
          >
            Select File to Validate
          </Button>
        </label>
      </Box>

      {fileInfo && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            File Information:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Name" 
                secondary={fileInfo.name}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Size" 
                secondary={formatFileSize(fileInfo.size)}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="MIME Type" 
                secondary={fileInfo.type}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Extension" 
                secondary={fileInfo.extension}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Last Modified" 
                secondary={new Date(fileInfo.lastModified).toLocaleString()}
              />
            </ListItem>
          </List>
        </Box>
      )}

      {validationResults && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Validation Results:
          </Typography>
          
          <Alert 
            severity={validationResults.overallValid ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">
              {validationResults.overallValid ? '✅ File is Valid' : '❌ File has Issues'}
            </Typography>
          </Alert>

          <List dense>
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {validationResults.hasValidName ? <CheckCircle color="success" /> : <Error color="error" />}
                <ListItemText 
                  primary="Valid Name" 
                  secondary={validationResults.hasValidName ? 'File has a name' : 'File name is empty'}
                />
              </Box>
            </ListItem>
            
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {validationResults.hasValidSize ? <CheckCircle color="success" /> : <Error color="error" />}
                <ListItemText 
                  primary="Valid Size" 
                  secondary={validationResults.hasValidSize ? `Size is ${formatFileSize(fileInfo.size)}` : 'File is empty or too large (>10MB)'}
                />
              </Box>
            </ListItem>
            
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {validationResults.hasValidType ? <CheckCircle color="success" /> : <Error color="error" />}
                <ListItemText 
                  primary="Valid MIME Type" 
                  secondary={validationResults.hasValidType ? `Type: ${fileInfo.type}` : 'Type not supported (only PDF, JPEG, PNG allowed)'}
                />
              </Box>
            </ListItem>
            
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {validationResults.hasValidExtension ? <CheckCircle color="success" /> : <Error color="error" />}
                <ListItemText 
                  primary="Valid Extension" 
                  secondary={validationResults.hasValidExtension ? `Extension: .${fileInfo.extension}` : 'Extension not supported (only .pdf, .jpg, .jpeg, .png allowed)'}
                />
              </Box>
            </ListItem>
            
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {validationResults.extensionMatchesType ? <CheckCircle color="success" /> : <Error color="error" />}
                <ListItemText 
                  primary="Extension Matches Type" 
                  secondary={validationResults.extensionMatchesType ? 'Extension and MIME type match' : 'Extension and MIME type do not match'}
                />
              </Box>
            </ListItem>
          </List>
        </Box>
      )}

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Tips:</strong>
        </Typography>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Make sure your file has the correct extension (.pdf, .jpg, .jpeg, .png)</li>
          <li>Ensure the file isn't corrupted</li>
          <li>Check that the file size is under 10MB</li>
          <li>Try renaming the file if extension doesn't match MIME type</li>
        </ul>
      </Alert>
    </Paper>
  );
};

export default FileValidator;

