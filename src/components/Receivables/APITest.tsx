import React, { useState } from 'react';
import { Box, Button, Typography, Alert, Paper, TextField } from '@mui/material';
import axios from 'axios';

const APITest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('https://exp.paydirectgo.com/files');

  const testDirectAPI = async () => {
    setIsLoading(true);
    setTestResult('Testing direct API call...');
    
    try {
      // Create a simple test file
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', testFile);
      formData.append('purpose', 'finance_document');

      console.log('Testing direct API call to:', customUrl);
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(customUrl, formData, {
        headers: {
          'Xflow-Account': 'account_F0A_1759166669125_GuHWS_000',
        },
        timeout: 30000,
      });

      setTestResult(`SUCCESS: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      console.error('Direct API test failed:', error);
      setTestResult(`FAILED: ${error.response?.status} - ${error.response?.data?.message || error.message}\n\nResponse data: ${JSON.stringify(error.response?.data, null, 2)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testWithCurl = () => {
    const curlCommand = `curl -X POST ${customUrl} \\
  -H "Xflow-Account: account_F0A_1759166669125_GuHWS_000" \\
  -F "file=@/path/to/your/document.pdf" \\
  -F "purpose=finance_document"`;
    
    setTestResult(`Try this curl command in your terminal:\n\n${curlCommand}\n\nThis will help verify if the API is working correctly.`);
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Direct API Test
      </Typography>
      
      <TextField
        fullWidth
        label="API URL"
        value={customUrl}
        onChange={(e) => setCustomUrl(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={testDirectAPI}
          disabled={isLoading}
        >
          Test Direct API Call
        </Button>
        
        <Button
          variant="outlined"
          onClick={testWithCurl}
        >
          Show cURL Command
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
        This component tests the API directly without using the file upload service.
        Use this to verify if the API endpoint is working correctly.
      </Typography>
    </Paper>
  );
};

export default APITest;

