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
  CircularProgress
} from '@mui/material';
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
    type: 'partner'
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IN', name: 'India' },
    { code: 'SG', name: 'Singapore' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' }
  ];

  const businessTypes = [
    { value: 'company', label: 'Company' },
    { value: 'individual', label: 'Individual' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'llc', label: 'LLC' }
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

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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
        type: 'partner'
      });
      
    } catch (error: any) {
      console.error('Error creating partner account:', error);
      toast.error(error.message || 'Failed to create partner account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Card className={styles.formCard}>
          <CardContent>
            <Box className={styles.header}>
              <Typography variant="h4" className={styles.title}>
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
      </div>
    </>
  );
};

export default PartnerAccountForm;
