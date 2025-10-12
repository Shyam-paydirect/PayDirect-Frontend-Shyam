import React, { useState } from 'react';
import { Box, Typography, Paper, Alert, Button } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

const CurlTest: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const curlCommand = `curl -X POST http://43.205.26.213:7015/files \\
  -H "Xflow-Account: account_F0A_1759166669125_GuHWS_000" \\
  -F "file=@/path/to/your/document.pdf" \\
  -F "purpose=finance_document"`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Test with cURL Command
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Try this exact curl command in your terminal to test the API directly:
      </Typography>

      <Box sx={{ 
        backgroundColor: '#f5f5f5', 
        p: 2, 
        borderRadius: 1, 
        fontFamily: 'monospace',
        fontSize: '12px',
        position: 'relative'
      }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {curlCommand}
        </pre>
        
        <Button
          size="small"
          startIcon={<ContentCopy />}
          onClick={copyToClipboard}
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8,
            minWidth: 'auto',
            padding: '4px 8px'
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Instructions:</strong>
        </Typography>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Replace <code>/path/to/your/document.pdf</code> with an actual file path</li>
          <li>Make sure the file exists and is accessible</li>
          <li>Run this command in your terminal</li>
          <li>Check the response to see if the API is working</li>
        </ul>
      </Alert>

      <Alert severity="success" sx={{ mt: 1 }}>
        <Typography variant="body2">
          <strong>✅ API Test Results:</strong>
        </Typography>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><strong>Success (201):</strong> JSON response with file details including ID and URL</li>
          <li><strong>Error (400):</strong> File type not supported - only PDF, JPEG, PNG allowed</li>
          <li><strong>Error (401):</strong> Unauthorized - check account header</li>
          <li><strong>Error (500):</strong> Unexpected field - wrong field names</li>
        </ul>
      </Alert>

      <Alert severity="info" sx={{ mt: 1 }}>
        <Typography variant="body2">
          <strong>📋 Working Example:</strong>
        </Typography>
        <pre style={{ fontSize: '11px', margin: '8px 0', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
{`curl -X POST http://43.205.26.213:7015/files \\
  -H "Xflow-Account: account_F0A_1759166669125_GuHWS_000" \\
  -F "file=@test.pdf" \\
  -F "purpose=finance_document"`}
        </pre>
        <Typography variant="caption">
          This command successfully uploaded a PDF file and returned a 201 response with file details.
        </Typography>
      </Alert>
    </Paper>
  );
};

export default CurlTest;
