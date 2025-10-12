import React, { useState } from 'react';
import { Box, Button, Typography, Alert, Paper } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import fileUploadService from '../../services/file-upload.service';

const FileUploadTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing API connection...');
    
    try {
      const healthResult = await fileUploadService.testConnection();
      const filesResult = await fileUploadService.testFilesEndpoint();
      
      setTestResult(`Health Check: ${healthResult.success ? 'SUCCESS' : 'FAILED'} - ${healthResult.message}\n\nFiles Endpoint: ${filesResult.success ? 'SUCCESS' : 'FAILED'} - ${filesResult.message}`);
    } catch (error: any) {
      setTestResult(`Connection Test: FAILED - ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setTestResult('Testing file upload...');
    
    try {
      // First try minimal upload
      const minimalResult = await fileUploadService.testUploadMinimal(file);
      setTestResult(`Minimal Upload Test: ${minimalResult.success ? 'SUCCESS' : 'FAILED'} - ${minimalResult.message}\n\n`);
      
      if (minimalResult.success) {
        // If minimal works, try with purpose
        const result = await fileUploadService.testUpload(file);
        setTestResult(prev => prev + `Full Upload Test: ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.message}`);
        
        if (result.data) {
          console.log('Upload response data:', result.data);
          setTestResult(prev => prev + `\nResponse: ${JSON.stringify(result.data, null, 2)}`);
        }
      } else {
        setTestResult(prev => prev + `Minimal upload failed, skipping full test.`);
      }
    } catch (error: any) {
      setTestResult(`Upload Test: FAILED - ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestPDF = async () => {
    setIsLoading(true);
    setTestResult('Testing with generated PDF file...');
    
    try {
      const result = await fileUploadService.testWithPDFFile();
      setTestResult(`PDF Test: ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.message}`);
      
      if (result.data) {
        console.log('PDF upload response data:', result.data);
        setTestResult(prev => prev + `\nResponse: ${JSON.stringify(result.data, null, 2)}`);
      }
    } catch (error: any) {
      setTestResult(`PDF Test: FAILED - ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        File Upload API Test
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          onClick={handleTestConnection}
          disabled={isLoading}
        >
          Test API Connection
        </Button>
        
        <Button
          variant="outlined"
          onClick={handleTestPDF}
          disabled={isLoading}
        >
          Test with Generated PDF
        </Button>
        
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUpload />}
          disabled={isLoading}
        >
          Test Your File
          <input
            type="file"
            hidden
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
          />
        </Button>
      </Box>

      {testResult && (
        <Alert 
          severity={testResult.includes('SUCCESS') ? 'success' : 'error'}
          sx={{ mt: 2 }}
        >
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {testResult}
          </pre>
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        This test component helps debug the file upload API integration.
        Check the browser console for detailed logs.
      </Typography>
    </Paper>
  );
};

export default FileUploadTest;
