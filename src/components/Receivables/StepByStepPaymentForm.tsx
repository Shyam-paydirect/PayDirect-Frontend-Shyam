import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Grid,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  CloudUpload,
  AttachFile,
  Delete,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  RadioButtonUnchecked
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import receivablesService, { ReceivablesData } from '../../services/receivables.service';

interface ReceivablesFormData {
  account_id: string;
  amount_maximum_reconcilable: string;
  currency: string;
  invoice: {
    amount: string;
    creation_date: string;
    currency: string;
    document: string;
    due_date: string;
    reference_number: string;
  };
  purpose_code: string;
  transaction_type: string;
}

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

interface StepByStepPaymentFormProps {
  onClose: () => void;
}

const StepByStepPaymentForm: React.FC<StepByStepPaymentFormProps> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ReceivablesFormData>({
    account_id: '',
    amount_maximum_reconcilable: '',
    currency: 'USD',
    invoice: {
      amount: '',
      creation_date: '',
      currency: 'USD',
      document: '',
      due_date: '',
      reference_number: ''
    },
    purpose_code: 'P1014',
    transaction_type: 'services'
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const steps = [
    {
      label: 'Payment Details',
      description: 'Provide remittance details.',
      content: 'paymentDetails'
    },
    {
      label: 'Upload Documents',
      description: 'Upload necessary documents.',
      content: 'uploadDocuments'
    },
    {
      label: 'Get and Book FX Rate',
      description: 'Fetch and confirm rates.',
      content: 'fxRate'
    },
    {
      label: 'Track Payment',
      description: 'Monitor the payment process.',
      content: 'trackPayment'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ReceivablesFormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, JPEG, or PNG file');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const uploadedFile: UploadedFile = {
      file,
      name: file.name,
      size: file.size,
      type: file.type
    };

    setUploadedFile(uploadedFile);
    handleInputChange('invoice.document', file.name);
    toast.success('File uploaded successfully');
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    handleInputChange('invoice.document', '');
  };

  const validateStep = (step: number): boolean => {
    const errors: { [key: string]: string } = {};

    switch (step) {
      case 0: // Payment Details
        if (!formData.invoice.amount.trim()) {
          errors['invoice.amount'] = 'Invoice amount is required';
        } else if (isNaN(Number(formData.invoice.amount)) || Number(formData.invoice.amount) <= 0) {
          errors['invoice.amount'] = 'Please enter a valid amount';
        }

        if (!formData.invoice.creation_date.trim()) {
          errors['invoice.creation_date'] = 'Date of transfer is required';
        }

        if (!formData.invoice.reference_number.trim()) {
          errors['invoice.reference_number'] = 'Invoice number is required';
        }

        if (!formData.purpose_code.trim()) {
          errors.purpose_code = 'Purpose code is required';
        }
        break;

      case 1: // Upload Documents
        if (!uploadedFile) {
          errors.document = 'Please upload a document';
        }
        break;

      case 2: // FX Rate
        // Add FX rate validation if needed
        break;

      case 3: // Track Payment
        // Add tracking validation if needed
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      toast.error('Please fix the validation errors');
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payload: ReceivablesData = {
        account_id: formData.account_id || 'default',
        amount_maximum_reconcilable: formData.amount_maximum_reconcilable || formData.invoice.amount,
        currency: formData.currency,
        invoice: {
          amount: formData.invoice.amount,
          creation_date: formData.invoice.creation_date,
          currency: formData.invoice.currency,
          document: formData.invoice.document,
          due_date: formData.invoice.due_date || formData.invoice.creation_date,
          reference_number: formData.invoice.reference_number
        },
        purpose_code: formData.purpose_code,
        transaction_type: formData.transaction_type
      };

      await receivablesService.createReceivable(payload);
      toast.success('Payment request created successfully!');
      onClose();
      
    } catch (error) {
      console.error('Error creating receivable:', error);
      toast.error('Failed to create payment request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTextField = (
    name: string,
    label: string,
    type: string = 'text',
    required: boolean = false,
    multiline: boolean = false,
    rows: number = 1
  ) => (
    <TextField
      fullWidth
      name={name}
      label={label}
      type={type}
      value={type === 'date' ? 
        (name.includes('.') ? 
          formData[name.split('.')[0] as keyof ReceivablesFormData][name.split('.')[1] as keyof typeof formData.invoice] : 
          formData[name as keyof ReceivablesFormData]
        ) : 
        (name.includes('.') ? 
          formData[name.split('.')[0] as keyof ReceivablesFormData][name.split('.')[1] as keyof typeof formData.invoice] : 
          formData[name as keyof ReceivablesFormData]
        )
      }
      onChange={(e) => handleInputChange(name, e.target.value)}
      error={!!validationErrors[name]}
      helperText={validationErrors[name]}
      required={required}
      multiline={multiline}
      rows={rows}
      InputLabelProps={{ shrink: type === 'date' ? true : undefined }}
    />
  );

  const renderPaymentDetails = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          {renderTextField('invoice.amount', 'Invoice Amount', 'number', true)}
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Currency</InputLabel>
            <Select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              label="Currency"
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          {renderTextField('invoice.creation_date', 'Date of Transfer', 'date', true)}
        </Grid>
        
        <Grid item xs={12} sm={6}>
          {renderTextField('invoice.reference_number', 'Invoice Number', 'text', true)}
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Purpose Code</InputLabel>
            <Select
              value={formData.purpose_code}
              onChange={(e) => handleInputChange('purpose_code', e.target.value)}
              label="Purpose Code"
            >
              <MenuItem value="P1014">P1014 - Services</MenuItem>
              <MenuItem value="P1015">P1015 - Goods</MenuItem>
              <MenuItem value="P1016">P1016 - Investment</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const renderUploadDocuments = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        border: '2px dashed #ccc', 
        borderRadius: 2, 
        p: 4, 
        textAlign: 'center',
        backgroundColor: '#fafafa'
      }}>
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUpload />}
            sx={{ mb: 2 }}
          >
            Upload Invoice File
          </Button>
        </label>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Supported formats: PDF, JPEG, PNG (Max 5MB)
        </Typography>
        
        {uploadedFile && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 1,
            p: 2,
            backgroundColor: '#e3f2fd',
            borderRadius: 1,
            mt: 2
          }}>
            <AttachFile color="primary" />
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
            <IconButton size="small" onClick={handleRemoveFile} color="error">
              <Delete />
            </IconButton>
          </Box>
        )}
        
        {validationErrors.document && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {validationErrors.document}
          </Alert>
        )}
      </Box>
    </Box>
  );

  const renderFXRate = () => (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        FX Rate Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Current exchange rate will be fetched and displayed here.
      </Typography>
      <Alert severity="info">
        FX rates are updated in real-time. Please confirm the rate before proceeding.
      </Alert>
    </Box>
  );

  const renderTrackPayment = () => (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Payment Tracking
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Your payment will be tracked and you'll receive updates on its status.
      </Typography>
      <Alert severity="success">
        Ready to submit your payment request!
      </Alert>
    </Box>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderPaymentDetails();
      case 1:
        return renderUploadDocuments();
      case 2:
        return renderFXRate();
      case 3:
        return renderTrackPayment();
      default:
        return null;
    }
  };

  const getProgressValue = () => {
    return ((activeStep + 1) / steps.length) * 100;
  };

  return (
    <Box sx={{ 
      padding: 3
    }}>
      <Card sx={{ 
        maxWidth: '1000px', 
        margin: '0 auto',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header with Progress */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
              Payment Progress
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={getProgressValue()} 
              sx={{ 
                height: 8, 
                borderRadius: 4, 
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: '#1976d2'
                }
              }} 
            />
          </Box>

          {/* Main Content */}
          <Box sx={{ display: 'flex', minHeight: '600px' }}>
            {/* Left Side - Steps */}
            <Box sx={{ 
              width: '300px', 
              borderRight: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
              p: 3
            }}>
              {steps.map((step, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: index <= activeStep ? '#1976d2' : '#e0e0e0',
                      color: index <= activeStep ? 'white' : '#666',
                      mr: 2,
                      fontSize: '14px',
                      fontWeight: 600
                    }}>
                      {index < activeStep ? <CheckCircle sx={{ fontSize: 20 }} /> : index + 1}
                    </Box>
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          color: index <= activeStep ? '#1976d2' : '#666',
                          fontSize: '14px'
                        }}
                      >
                        {step.label}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: index <= activeStep ? '#1976d2' : '#666',
                          fontSize: '12px'
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>
                  {index < steps.length - 1 && (
                    <Box sx={{ 
                      width: '2px', 
                      height: '20px', 
                      backgroundColor: index < activeStep ? '#1976d2' : '#e0e0e0',
                      ml: '15px'
                    }} />
                  )}
                </Box>
              ))}
            </Box>

            {/* Right Side - Step Content */}
            <Box sx={{ flex: 1, p: 0 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {steps[activeStep].label}
                </Typography>
              </Box>
              {renderStepContent()}
            </Box>
          </Box>

          {/* Footer with Navigation */}
          <Box sx={{ 
            p: 3, 
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Button
              onClick={onClose}
              variant="outlined"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              )}
              
              {activeStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  endIcon={<ArrowForward />}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Payment Request'}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StepByStepPaymentForm;
