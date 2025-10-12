import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Chip
} from '@mui/material';
import { 
  Add,
  ExpandMore,
  ExpandLess,
  Business,
  Email,
  LocationOn
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import partnerAccountService, { PartnerAccountData } from '../../services/partner-account.service';
import styles from './partner-account-form.module.css';

interface PartnerAccountFormData {
  business_details: {
    email: string;
    legal_name: string;
    physical_address: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      postal_code: string;
      state: string;
    };
    type: string;
  };
  nickname: string;
  type: string;
  account_id: string;
}

interface PartnerItem {
  id: string;
  legalName: string;
  email: string;
  businessType: string;
  city: string;
  country: string;
  nickname: string;
  receivables: number;
  amountPending: number;
  currency: string;
  status: 'active' | 'inactive' | 'pending';
}

const PartnerAccountForm: React.FC = () => {
  const [formData, setFormData] = useState<PartnerAccountFormData>({
    business_details: {
      email: '',
      legal_name: '',
      physical_address: {
        city: '',
        country: '',
        line1: '',
        line2: '',
        postal_code: '',
        state: ''
      },
      type: 'company'
    },
    nickname: '',
    type: 'partner',
    account_id: 'account_F0A_1759166669125_GuHWS_000'
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(false);

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IN', label: 'India' },
    { value: 'SG', label: 'Singapore' },
    { value: 'JP', label: 'Japan' },
    { value: 'CN', label: 'China' }
  ];

  const businessTypes = [
    { value: 'company', label: 'Company' },
    { value: 'individual', label: 'Individual' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'llc', label: 'LLC' }
  ];

  // Mock data for partners table
  const mockPartners: PartnerItem[] = [
    {
      id: '1',
      legalName: 'Acme Business Pvt. Ltd.',
      email: 'contact@acme-business.com',
      businessType: 'Company',
      city: 'San Francisco',
      country: 'United States',
      nickname: 'Acme-Business-USD',
      receivables: 50000,
      amountPending: 25000,
      currency: 'USD',
      status: 'active'
    },
    {
      id: '2',
      legalName: 'Tech Solutions Inc.',
      email: 'info@techsolutions.com',
      businessType: 'LLC',
      city: 'New York',
      country: 'United States',
      nickname: 'Tech-Solutions-USD',
      receivables: 75000,
      amountPending: 15000,
      currency: 'USD',
      status: 'active'
    },
    {
      id: '3',
      legalName: 'Global Services Ltd.',
      email: 'admin@globalservices.com',
      businessType: 'Company',
      city: 'London',
      country: 'United Kingdom',
      nickname: 'Global-Services-GBP',
      receivables: 30000,
      amountPending: 0,
      currency: 'GBP',
      status: 'inactive'
    },
    {
      id: '4',
      legalName: 'Innovation Hub',
      email: 'hello@innovationhub.com',
      businessType: 'Partnership',
      city: 'Toronto',
      country: 'Canada',
      nickname: 'Innovation-Hub-CAD',
      receivables: 40000,
      amountPending: 20000,
      currency: 'CAD',
      status: 'pending'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      if (field.startsWith('physical_address.')) {
        const addressField = field.split('.')[1];
        newData.business_details.physical_address = {
          ...newData.business_details.physical_address,
          [addressField]: value
        };
      } else if (field.startsWith('business_details.')) {
        const businessField = field.split('.')[1];
        newData.business_details = {
          ...newData.business_details,
          [businessField]: value
        };
      } else {
        (newData as any)[field] = value;
      }
      
      return newData;
    });

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validate business details
    if (!formData.business_details.email) {
      errors['business_details.email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.business_details.email)) {
      errors['business_details.email'] = 'Please enter a valid email';
    }

    if (!formData.business_details.legal_name) {
      errors['business_details.legal_name'] = 'Legal name is required';
    }

    // Validate physical address
    if (!formData.business_details.physical_address.line1) {
      errors['physical_address.line1'] = 'Address line 1 is required';
    }

    if (!formData.business_details.physical_address.city) {
      errors['physical_address.city'] = 'City is required';
    }

    if (!formData.business_details.physical_address.state) {
      errors['physical_address.state'] = 'State is required';
    }

    if (!formData.business_details.physical_address.postal_code) {
      errors['physical_address.postal_code'] = 'Postal code is required';
    }

    if (!formData.business_details.physical_address.country) {
      errors['physical_address.country'] = 'Country is required';
    }

    if (!formData.nickname) {
      errors['nickname'] = 'Nickname is required';
    }

    if (!formData.account_id) {
      errors['account_id'] = 'Account ID is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);
      console.log('Fetching partners from API...');
      
      // Try to fetch from the new API first
      try {
        const data = await partnerAccountService.getAllPartners();
        console.log('Partners fetched from API:', data);
        
        // Transform API data to match the expected format
        const transformedPartners: PartnerItem[] = data.map((partner: any, index: number) => ({
          id: partner.id || `partner_${index}`,
          legalName: partner.business_details?.legal_name || 'Unknown',
          email: partner.business_details?.email || 'No email',
          businessType: partner.business_details?.type || 'Unknown',
          city: partner.business_details?.physical_address?.city || 'Unknown',
          country: partner.business_details?.physical_address?.country || 'Unknown',
          nickname: partner.nickname || 'No nickname',
          receivables: partner.receivables || 0,
          amountPending: partner.amount_pending || 0,
          currency: partner.currency || 'USD',
          status: partner.status || 'active'
        }));
        
        setPartners(transformedPartners);
        toast.success('Partners loaded successfully');
      } catch (apiError: any) {
        console.warn('API fetch failed, using mock data:', apiError.message);
        // Fallback to mock data if API fails
        setPartners(mockPartners);
        toast.warning('Using sample data - API connection failed');
      }
    } catch (err: any) {
      console.error('Error in fetchPartners:', err);
      toast.error('Failed to fetch partners');
      // Fallback to mock data
      setPartners(mockPartners);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerById = async (partnerId: string) => {
    try {
      console.log('Fetching partner by ID:', partnerId);
      const partner = await partnerAccountService.getPartnerById(partnerId);
      console.log('Partner details:', partner);
      return partner;
    } catch (error: any) {
      console.error('Error fetching partner by ID:', error);
      toast.error(`Failed to fetch partner details: ${error.message}`);
      throw error;
    }
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await partnerAccountService.createPartnerAccount(formData as PartnerAccountData);
      
      toast.success(response.message || 'Partner account created successfully!');
      
      // Refresh the partners list from the API
      console.log('Refreshing partners list after creation...');
      await fetchPartners();

      // Reset form
      setFormData({
        business_details: {
          email: '',
          legal_name: '',
          physical_address: {
            city: '',
            country: '',
            line1: '',
            line2: '',
            postal_code: '',
            state: ''
          },
          type: 'company'
        },
        nickname: '',
        type: 'partner',
        account_id: 'account_F0A_1759166669125_GuHWS_000'
      });
      setIsFormOpen(false);
      
    } catch (error: any) {
      console.error('Error creating partner account:', error);
      toast.error(error.message || 'Failed to create partner account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load partners on component mount
  React.useEffect(() => {
    fetchPartners();
  }, []);

  const renderTextField = (
    field: string,
    label: string,
    type: string = 'text',
    required: boolean = true,
    multiline: boolean = false,
    rows: number = 1
  ) => {
    const getValue = () => {
      if (field.startsWith('physical_address.')) {
        const addressField = field.split('.')[1];
        return formData.business_details.physical_address[addressField as keyof typeof formData.business_details.physical_address];
      } else if (field.startsWith('business_details.')) {
        const businessField = field.split('.')[1];
        return formData.business_details[businessField as keyof typeof formData.business_details];
      } else {
        return (formData as any)[field];
      }
    };

    return (
      <TextField
        fullWidth
        type={type}
        name={field}
        label={label}
        value={getValue()}
        onChange={(e) => handleInputChange(field, e.target.value)}
        required={required}
        multiline={multiline}
        rows={rows}
        error={!!validationErrors[field]}
        helperText={validationErrors[field]}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            backgroundColor: '#fff',
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4299e1',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#4a5568',
            '&.Mui-focused': {
              color: '#4299e1',
            },
          },
        }}
      />
    );
  };

  const renderSelectField = (
    field: string,
    label: string,
    options: { value: string; label: string }[],
    required: boolean = true
  ) => {
    const getValue = () => {
      if (field.startsWith('business_details.')) {
        const businessField = field.split('.')[1];
        return formData.business_details[businessField as keyof typeof formData.business_details];
      } else if (field.startsWith('physical_address.')) {
        const addressField = field.split('.')[1];
        return formData.business_details.physical_address[addressField as keyof typeof formData.business_details.physical_address];
      } else {
        return (formData as any)[field];
      }
    };

    return (
      <FormControl fullWidth error={!!validationErrors[field]}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={getValue()}
          onChange={(e) => handleInputChange(field, e.target.value)}
          label={label}
          sx={{
            borderRadius: '10px',
            backgroundColor: '#fff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e2e8f0',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#cbd5e0',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4299e1',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {validationErrors[field] && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
            {validationErrors[field]}
          </Typography>
        )}
      </FormControl>
    );
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.container}>
        {/* Header */}
        <Box sx={{ marginBottom: '24px' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a202c', marginBottom: '8px' }}>
            Partner Account Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#4a5568' }}>
            Manage your partner accounts and track receivables
          </Typography>
        </Box>

        {/* Create Partner Account Button */}
        <Box sx={{ marginBottom: '24px' }}>
          <Button
            variant="contained"
            startIcon={isFormOpen ? <ExpandLess /> : <Add />}
            onClick={toggleForm}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              padding: '12px 24px',
              backgroundColor: '#4299e1',
              '&:hover': {
                backgroundColor: '#3182ce',
              },
            }}
          >
            {isFormOpen ? 'Hide Create Form' : 'Create New Partner Account'}
          </Button>
        </Box>

        {/* Collapsible Form */}
        <Collapse in={isFormOpen}>
          <Card className={styles.formCard} sx={{ marginBottom: '24px' }}>
            <CardContent>
              <Box className={styles.header}>
                <Typography variant="h5" className={styles.title}>
                  Create Partner Account
                </Typography>
                <Typography variant="body1" className={styles.subtitle}>
                  Fill in the details below to create a new partner account
                </Typography>
              </Box>

              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Business Details Section */}
                <Box className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Business Details
                  </Typography>
                  
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      {renderTextField('business_details.email', 'Email Address', 'email')}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {renderTextField('business_details.legal_name', 'Legal Name')}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {renderSelectField('business_details.type', 'Business Type', businessTypes)}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {renderTextField('nickname', 'Account Nickname')}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {renderTextField('account_id', 'Account ID')}
                    </Grid>
                  </Grid>
                </Box>

                {/* Physical Address Section */}
                <Box className={styles.formSection}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Physical Address
                  </Typography>
                  
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      {renderTextField('physical_address.line1', 'Address Line 1')}
                    </Grid>
                    <Grid item xs={12}>
                      {renderTextField('physical_address.line2', 'Address Line 2 (Optional)', 'text', false)}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {renderTextField('physical_address.city', 'City')}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {renderTextField('physical_address.state', 'State/Province')}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {renderTextField('physical_address.postal_code', 'Postal Code')}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {renderSelectField('physical_address.country', 'Country', countries)}
                    </Grid>
                  </Grid>
                </Box>

                {/* Form Actions */}
                <Box className={styles.formActions}>
                  <Button
                    type="button"
                    variant="outlined"
                    size="large"
                    onClick={() => setIsFormOpen(false)}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      padding: '12px 24px',
                      marginRight: '16px',
                      borderColor: '#e2e8f0',
                      color: '#4a5568',
                      '&:hover': {
                        borderColor: '#cbd5e0',
                        backgroundColor: '#f7fafc',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      padding: '12px 24px',
                      backgroundColor: '#4299e1',
                      '&:hover': {
                        backgroundColor: '#3182ce',
                      },
                      '&:disabled': {
                        backgroundColor: '#a0aec0',
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} sx={{ marginRight: 1 }} />
                        Creating Account...
                      </>
                    ) : (
                      'Create Partner Account'
                    )}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Collapse>

        {/* Partners Table */}
        <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a202c' }}>
                Partners
              </Typography>
              <Button
                variant="outlined"
                onClick={fetchPartners}
                disabled={loading}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                }}
              >
                {loading ? <CircularProgress size={20} /> : 'Refresh'}
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f7fafc' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Partner Information</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Receivables</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Amount Pending</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow 
                      key={partner.id} 
                      sx={{ 
                        '&:hover': { backgroundColor: '#f7fafc', cursor: 'pointer' },
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        console.log('Partner clicked:', partner.id);
                        // You can add more functionality here, like opening a modal or navigating to details
                        toast.info(`Partner: ${partner.legalName} (ID: ${partner.id})`);
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Business sx={{ fontSize: 16, color: '#4299e1' }} />
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a202c' }}>
                              {partner.legalName}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Email sx={{ fontSize: 14, color: '#718096' }} />
                            <Typography variant="body2" sx={{ color: '#4a5568' }}>
                              {partner.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <LocationOn sx={{ fontSize: 14, color: '#718096' }} />
                            <Typography variant="body2" sx={{ color: '#4a5568' }}>
                              {partner.city}, {partner.country}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#718096', marginTop: '4px', display: 'block' }}>
                            {partner.businessType} • {partner.nickname}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a202c' }}>
                          {formatCurrency(partner.receivables, partner.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#e53e3e' }}>
                          {formatCurrency(partner.amountPending, partner.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                          color={getStatusColor(partner.status) as any}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {partners.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', padding: '40px' }}>
                <Typography variant="h6" sx={{ color: '#718096', marginBottom: '8px' }}>
                  No partners found
                </Typography>
                <Typography variant="body2" sx={{ color: '#a0aec0' }}>
                  Create your first partner account to get started
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PartnerAccountForm;
