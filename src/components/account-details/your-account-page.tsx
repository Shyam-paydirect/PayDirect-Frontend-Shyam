import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Tabs, Tab, IconButton, Tooltip } from '@mui/material';
import { ContentCopy, Visibility, ArrowBack } from '@mui/icons-material';
import { toast } from 'react-toastify';

interface YourAccountPageProps {
  onBack: () => void;
}

const YourAccountPage: React.FC<YourAccountPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCopyInfo = () => {
    const getAccountInfo = () => {
      const baseInfo = `
Beneficiary: PayDirect
Receiving Currency: USD
Account Number: 91216802238219
Account Type: Business Checking
Bank: JPMORGAN CHASE BANK, N.A
Bank Address: 383 Madison Ave, New York, NY 10179, USA`;
      
      if (activeTab === 0) { // ACH
        return baseInfo + '\nRouting Number: 000000007';
      } else if (activeTab === 1) { // Fedwire
        return baseInfo + '\nABA Code / Routing Number: 000000007';
      } else { // SWIFT
        return baseInfo + '\nBIC Code: CHASUS33XXX';
      }
    };
    
    navigator.clipboard.writeText(getAccountInfo().trim());
    toast.success('Account information copied to clipboard!');
  };

  const handleViewMore = () => {
    toast.info('View more functionality coming soon!');
  };

  const renderAccountDetails = () => (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          sx={{ 
            minHeight: 'auto',
            '& .MuiTabs-indicator': {
              display: 'none' // Hide default indicator since we're using custom styling
            }
          }}
        >
          <Tab 
            label="ACH" 
            sx={{ 
              minHeight: 'auto',
              padding: '8px 16px',
              backgroundColor: activeTab === 0 ? '#1976d2' : 'transparent',
              color: activeTab === 0 ? '#ffffff' : '#666666',
              borderRadius: '4px 4px 0 0',
              marginRight: 1,
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: activeTab === 0 ? 'scale(1.02)' : 'scale(1)',
              boxShadow: activeTab === 0 ? '0 2px 8px rgba(25, 118, 210, 0.3)' : 'none',
              '&:hover': {
                backgroundColor: activeTab === 0 ? '#1565c0' : 'rgba(25, 118, 210, 0.08)',
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out'
              },
              '&.Mui-selected': {
                color: '#ffffff !important'
              }
            }} 
          />
          <Tab 
            label="Fedwire" 
            sx={{ 
              minHeight: 'auto',
              padding: '8px 16px',
              backgroundColor: activeTab === 1 ? '#1976d2' : 'transparent',
              color: activeTab === 1 ? '#ffffff' : '#666666',
              borderRadius: '4px 4px 0 0',
              marginRight: 1,
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: activeTab === 1 ? 'scale(1.02)' : 'scale(1)',
              boxShadow: activeTab === 1 ? '0 2px 8px rgba(25, 118, 210, 0.3)' : 'none',
              '&:hover': {
                backgroundColor: activeTab === 1 ? '#1565c0' : 'rgba(25, 118, 210, 0.08)',
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out'
              },
              '&.Mui-selected': {
                color: '#ffffff !important'
              }
            }} 
          />
          <Tab 
            label="SWIFT" 
            sx={{ 
              minHeight: 'auto',
              padding: '8px 16px',
              backgroundColor: activeTab === 2 ? '#1976d2' : 'transparent',
              color: activeTab === 2 ? '#ffffff' : '#666666',
              borderRadius: '4px 4px 0 0',
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: activeTab === 2 ? 'scale(1.02)' : 'scale(1)',
              boxShadow: activeTab === 2 ? '0 2px 8px rgba(25, 118, 210, 0.3)' : 'none',
              '&:hover': {
                backgroundColor: activeTab === 2 ? '#1565c0' : 'rgba(25, 118, 210, 0.08)',
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out'
              },
              '&.Mui-selected': {
                color: '#ffffff !important'
              }
            }} 
          />
        </Tabs>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="text"
            startIcon={<ContentCopy />}
            onClick={handleCopyInfo}
            sx={{ 
              color: '#1976d2', 
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            Copy Info
          </Button>
          <Button
            variant="text"
            startIcon={<Visibility />}
            onClick={handleViewMore}
            sx={{ 
              color: '#1976d2', 
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            View More
          </Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <CardContent sx={{ padding: 0 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            '& > div': {
              padding: '16px 20px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '60px'
            },
            '& > div:nth-of-type(odd)': {
              backgroundColor: '#fafafa'
            },
            '& > div:nth-of-type(even)': {
              backgroundColor: 'white'
            },
            '& > div:last-child, & > div:nth-last-child(2)': {
              borderBottom: 'none'
            }
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '14px' }}>
                Beneficiary
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '15px' }}>
                PayDirect
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '14px' }}>
                Receiving Currency
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '15px' }}>
                USD
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '14px' }}>
                Account Number
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '15px' }}>
                91216802238219
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '14px' }}>
                {activeTab === 0 ? 'Routing Number' : activeTab === 1 ? 'ABA Code / Routing Number' : 'BIC Code'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '15px' }}>
                {activeTab === 2 ? 'CHASUS33XXX' : '000000007'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '14px' }}>
                Account Type
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '15px' }}>
                Business Checking
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '14px' }}>
                Bank
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '15px' }}>
                JPMORGAN CHASE BANK, N.A
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '14px' }}>
                Bank Address
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '15px' }}>
                383 Madison Ave, New York, NY 10179, USA
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: 3
    }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBack />}
        onClick={onBack}
        sx={{ 
          marginBottom: 2,
          textTransform: 'none',
          borderRadius: 2
        }}
      >
        Back
      </Button>
      
      <Box sx={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {renderAccountDetails()}
      </Box>
    </Box>
  );
};

export default YourAccountPage;
