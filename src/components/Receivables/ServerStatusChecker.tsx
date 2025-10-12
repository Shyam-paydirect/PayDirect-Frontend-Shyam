import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, Chip, CircularProgress } from '@mui/material';
import { CheckCircle, Error, Warning, Refresh } from '@mui/icons-material';

const ServerStatusChecker: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkServerStatus = async () => {
    setIsChecking(true);
    setStatus(null);

    const checks = [
      {
        name: 'API Health Endpoint',
        url: 'http://43.205.26.213:7015/health',
        method: 'GET'
      },
      {
        name: 'API Files Endpoint',
        url: 'http://43.205.26.213:7015/files',
        method: 'GET'
      }
    ];

    const results = [];

    for (const check of checks) {
      try {
        const startTime = Date.now();
        const response = await fetch(check.url, {
          method: check.method,
          headers: {
            'Xflow-Account': 'account_F0A_1759166669125_GuHWS_000',
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        results.push({
          name: check.name,
          status: 'success',
          message: `✅ Connected (${responseTime}ms)`,
          details: `Status: ${response.status} ${response.statusText}`,
          responseTime
        });
      } catch (error: any) {
        let errorMessage = 'Unknown error';
        let errorType = 'error';

        if (error.name === 'AbortError') {
          errorMessage = '⏱️ Request timeout (10s)';
          errorType = 'warning';
        } else if (error.message.includes('Connection refused')) {
          errorMessage = '🚫 Connection refused - Server may be down';
        } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
          errorMessage = '🌐 Cannot resolve hostname';
        } else if (error.message.includes('Network Error')) {
          errorMessage = '📡 Network error - Check internet connection';
        } else {
          errorMessage = `❌ ${error.message}`;
        }

        results.push({
          name: check.name,
          status: errorType,
          message: errorMessage,
          details: error.message,
          responseTime: null
        });
      }
    }

    setStatus({
      timestamp: new Date().toLocaleString(),
      results
    });
    setIsChecking(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <Error color="error" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'error';
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Server Status Checker
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Check if the file upload API server is reachable and responding.
      </Typography>

      <Button
        variant="contained"
        startIcon={isChecking ? <CircularProgress size={20} /> : <Refresh />}
        onClick={checkServerStatus}
        disabled={isChecking}
        sx={{ mb: 2 }}
      >
        {isChecking ? 'Checking...' : 'Check Server Status'}
      </Button>

      {status && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Last checked: {status.timestamp}
          </Typography>

          {status.results.map((result: any, index: number) => (
            <Alert 
              key={index}
              severity={getStatusColor(result.status) as any}
              sx={{ mb: 1 }}
              icon={getStatusIcon(result.status)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Box>
                  <Typography variant="subtitle2">
                    {result.name}
                  </Typography>
                  <Typography variant="body2">
                    {result.message}
                  </Typography>
                  {result.details && (
                    <Typography variant="caption" color="text.secondary">
                      {result.details}
                    </Typography>
                  )}
                </Box>
                {result.responseTime && (
                  <Chip 
                    label={`${result.responseTime}ms`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                )}
              </Box>
            </Alert>
          ))}

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>What this means:</strong>
            </Typography>
            <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '14px' }}>
              <li><strong>✅ Success:</strong> Server is reachable and responding</li>
              <li><strong>⚠️ Warning:</strong> Server is reachable but slow or has issues</li>
              <li><strong>❌ Error:</strong> Server is not reachable or has problems</li>
            </ul>
          </Alert>
        </Box>
      )}

      <Alert severity="warning" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Current API Configuration:</strong>
        </Typography>
        <Typography variant="caption" component="div">
          URL: http://43.205.26.213:7015
        </Typography>
        <Typography variant="caption" component="div">
          Account: account_F0A_1759166669125_GuHWS_000
        </Typography>
      </Alert>
    </Paper>
  );
};

export default ServerStatusChecker;

