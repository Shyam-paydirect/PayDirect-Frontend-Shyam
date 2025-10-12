import React, { useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box, 
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
  Alert
} from '@mui/material';
import { 
  CloudUpload,
  AttachFile,
  Delete,
  Close
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

interface ReceivablesFormModalProps {
  open: boolean;
  onClose: () => void;
}

const ReceivablesFormModal: React.FC<ReceivablesFormModalProps> = ({ open, onClose }) => {
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

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.account_id.trim()) {
      errors.account_id = 'Account ID is required';
    }

    if (!formData.amount_maximum_reconcilable.trim()) {
      errors.amount_maximum_reconcilable = 'Maximum reconcilable amount is required';
    } else if (isNaN(Number(formData.amount_maximum_reconcilable)) || Number(formData.amount_maximum_reconcilable) <= 0) {
      errors.amount_maximum_reconcilable = 'Please enter a valid amount';
    }

    if (!formData.invoice.amount.trim()) {
      errors['invoice.amount'] = 'Invoice amount is required';
    } else if (isNaN(Number(formData.invoice.amount)) || Number(formData.invoice.amount) <= 0) {
      errors['invoice.amount'] = 'Please enter a valid amount';
    }

    if (!formData.invoice.creation_date.trim()) {
      errors['invoice.creation_date'] = 'Creation date is required';
    }

    if (!formData.invoice.due_date.trim()) {
      errors['invoice.due_date'] = 'Due date is required';
    }

    if (!formData.invoice.reference_number.trim()) {
      errors['invoice.reference_number'] = 'Reference number is required';
    }

    if (!formData.purpose_code.trim()) {
      errors.purpose_code = 'Purpose code is required';
    }

    if (!formData.transaction_type.trim()) {
      errors.transaction_type = 'Transaction type is required';
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
      const payload: ReceivablesData = {
        account_id: formData.account_id,
        amount_maximum_reconcilable: formData.amount_maximum_reconcilable,
        currency: formData.currency,
        invoice: {
          amount: formData.invoice.amount,
          creation_date: formData.invoice.creation_date,
          currency: formData.invoice.currency,
          document: formData.invoice.document,
          due_date: formData.invoice.due_date,
          reference_number: formData.invoice.reference_number
        },
        purpose_code: formData.purpose_code,
        transaction_type: formData.transaction_type
      };

      await receivablesService.createReceivable(payload);
      toast.success('Receivable created successfully!');
      
      // Reset form
      setFormData({
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
      setUploadedFile(null);
      setValidationErrors({});
      onClose();
      
    } catch (error) {
      console.error('Error creating receivable:', error);
      toast.error('Failed to create receivable. Please try again.');
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

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" component="div">
          Create New Receivable
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          <Grid container spacing={3}>
            {/* Account Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                Account Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              {renderTextField('account_id', 'Account ID', 'text', true)}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              {renderTextField('amount_maximum_reconcilable', 'Maximum Reconcilable Amount', 'number', true)}
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

            {/* Invoice Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600, mt: 2 }}>
                Invoice Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              {renderTextField('invoice.amount', 'Invoice Amount', 'number', true)}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Invoice Currency</InputLabel>
                <Select
                  value={formData.invoice.currency}
                  onChange={(e) => handleInputChange('invoice.currency', e.target.value)}
                  label="Invoice Currency"
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="INR">INR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              {renderTextField('invoice.creation_date', 'Creation Date', 'date', true)}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              {renderTextField('invoice.due_date', 'Due Date', 'date', true)}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              {renderTextField('invoice.reference_number', 'Reference Number', 'text', true)}
            </Grid>

            {/* File Upload Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
                Invoice Document
              </Typography>
              <Box sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                p: 3, 
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
              </Box>
            </Grid>

            {/* Transaction Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600, mt: 2 }}>
                Transaction Details
              </Typography>
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
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={formData.transaction_type}
                  onChange={(e) => handleInputChange('transaction_type', e.target.value)}
                  label="Transaction Type"
                >
                  <MenuItem value="services">Services</MenuItem>
                  <MenuItem value="goods">Goods</MenuItem>
                  <MenuItem value="investment">Investment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Creating...' : 'Create Receivable'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReceivablesFormModal;



