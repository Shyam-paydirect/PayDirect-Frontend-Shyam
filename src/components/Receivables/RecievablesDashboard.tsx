import React, { useState, useEffect } from 'react';
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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Link
} from '@mui/material';
import { 
  CloudUpload,
  AttachFile,
  Delete,
  Add,
  ExpandMore,
  ExpandLess,
  AccountBalance
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import receivablesService, { ReceivablesData, ReceivableApiItem } from '../../services/receivables.service';
import fileUploadService from '../../services/file-upload.service';
import './RecievablesDashboard.css';

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

interface ReceivableItem {
  id: string;
  created: string;
  invoiceNo: string;
  partnerName: string;
  description: string;
  receivableAmount: number;
  amountPending: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  currency: string;
}

const RecievablesDashboard: React.FC = () => {
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string>('');
  const [receivables, setReceivables] = useState<ReceivableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [reconcileModalOpen, setReconcileModalOpen] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState<ReceivableItem | null>(null);
  const [reconcileAmount, setReconcileAmount] = useState<string>('');
  const [reconcileCurrency, setReconcileCurrency] = useState<string>('USD');

  // Auto-open form when component loads and fetch receivables data
  useEffect(() => {
    const prevComponent = localStorage.getItem('prev_component');
    if (prevComponent === 'currency-management') {
      setIsFormOpen(true);
    }
    // Fetch receivables data on component mount
    fetchReceivables();
  }, []);

  // Mock data for receivables table
  const mockReceivables: ReceivableItem[] = [
    {
      id: '1',
      created: '2024-01-15',
      invoiceNo: 'INV-2024-001',
      partnerName: 'ABC Corporation',
      description: 'Software Development Services',
      receivableAmount: 50000,
      amountPending: 50000,
      status: 'pending',
      currency: 'USD'
    },
    {
      id: '2',
      created: '2024-01-10',
      invoiceNo: 'INV-2024-002',
      partnerName: 'XYZ Ltd',
      description: 'Consulting Services',
      receivableAmount: 75000,
      amountPending: 75000,
      status: 'overdue',
      currency: 'EUR'
    },
    {
      id: '3',
      created: '2024-01-05',
      invoiceNo: 'INV-2024-003',
      partnerName: 'Tech Solutions Inc',
      description: 'Maintenance Contract',
      receivableAmount: 30000,
      amountPending: 0,
      status: 'paid',
      currency: 'GBP'
    }
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar' },
    { value: 'EUR', label: 'Euro' },
    { value: 'GBP', label: 'British Pound' },
    { value: 'CAD', label: 'Canadian Dollar' },
    { value: 'AUD', label: 'Australian Dollar' },
    { value: 'JPY', label: 'Japanese Yen' },
    { value: 'CHF', label: 'Swiss Franc' },
    { value: 'INR', label: 'Indian Rupee' }
  ];

  const purposeCodes = [
    { value: 'P1014', label: 'Services' },
    { value: 'P1015', label: 'Goods' },
    { value: 'P1016', label: 'Consulting' },
    { value: 'P1017', label: 'Software' },
    { value: 'P1018', label: 'Maintenance' },
    { value: 'P1019', label: 'Training' },
    { value: 'P1020', label: 'Support' }
  ];

  const transactionTypes = [
    { value: 'services', label: 'Services' },
    { value: 'goods', label: 'Goods' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'training', label: 'Training' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      if (field.startsWith('invoice.')) {
        const invoiceField = field.split('.')[1];
        newData.invoice = {
          ...newData.invoice,
          [invoiceField]: value
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, JPEG, or PNG file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload file using the FileUploadService - simplified to match curl call
      const uploadResponse = await fileUploadService.uploadFile({
        file: file,
        purpose: 'finance_document' // Keep purpose for interface compatibility
      });

      // Store the uploaded file data
      const uploadedFileData: UploadedFile = {
        file,
        name: file.name,
        size: file.size,
        type: file.type
      };

      setUploadedFile(uploadedFileData);
      setUploadedFileId(uploadResponse.id);
      
      // Update the document field with the file ID from API response
      handleInputChange('invoice.document', uploadResponse.id);
      
      toast.success('File uploaded successfully to server');
      console.log('File upload response:', uploadResponse);
      
    } catch (error: any) {
      console.error('File upload error:', error);
      toast.error(`File upload failed: ${error.message}`);
      
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadedFileId(null);
    handleInputChange('invoice.document', '');
  };

  const handleDiagnoseUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDiagnosticResult('Running diagnostic...');
    
    try {
      const result = await fileUploadService.diagnoseUploadIssue(file);
      setDiagnosticResult(JSON.stringify(result, null, 2));
      console.log('Diagnostic result:', result);
    } catch (error: any) {
      setDiagnosticResult(`Diagnostic failed: ${error.message}`);
    }
  };

  const handleTestAPIConnection = async () => {
    setDiagnosticResult('Testing API connection...');
    
    try {
      const result = await fileUploadService.testConnection();
      setDiagnosticResult(`API Connection Test:\n\nSuccess: ${result.success}\nMessage: ${result.message}`);
      console.log('API connection test result:', result);
    } catch (error: any) {
      setDiagnosticResult(`API connection test failed: ${error.message}`);
    }
  };

  const handleTestCurlStyleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDiagnosticResult('Testing curl-style upload...');
    
    try {
      const result = await fileUploadService.testCurlStyleUpload(file);
      setDiagnosticResult(`Curl-Style Upload Test:\n\nSuccess: ${result.success}\nMessage: ${result.message}\n\nData: ${JSON.stringify(result.data, null, 2)}`);
      console.log('Curl-style upload test result:', result);
    } catch (error: any) {
      setDiagnosticResult(`Curl-style upload test failed: ${error.message}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fetchReceivables = async () => {
    try {
      setLoading(true);
      // Fetch receivables from API: http://43.205.26.213:7015/receivables
      // with Xflow-Account header: account_F0A_1759166669125_GuHWS_000
      const data = await receivablesService.getReceivables();
      
      // Log the actual API response to understand the structure
      console.log('API Response:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      
      // Handle different response formats
      let receivablesArray: ReceivableApiItem[] = [];
      
      if (Array.isArray(data)) {
        // If data is already an array
        receivablesArray = data;
      } else if (data && typeof data === 'object') {
        // If data is an object, check for common array properties
        if (data.receivables && Array.isArray(data.receivables)) {
          receivablesArray = data.receivables;
        } else if (data.data && Array.isArray(data.data)) {
          receivablesArray = data.data;
        } else if (data.items && Array.isArray(data.items)) {
          receivablesArray = data.items;
        } else if (data.results && Array.isArray(data.results)) {
          receivablesArray = data.results;
        } else {
          // If it's a single object, wrap it in an array
          receivablesArray = [data];
        }
      }
      
      // Transform API data to match our interface
      const transformedData = receivablesArray.map((item: ReceivableApiItem, index: number) => {
        // Ensure we have a valid item
        if (!item || typeof item !== 'object') {
          console.warn('Invalid item at index', index, ':', item);
          return {
            id: `invalid_${index}`,
            created: new Date().toISOString().split('T')[0],
            invoiceNo: `INV-${index + 1}`,
            partnerName: 'Invalid Data',
            description: 'Invalid receivable data',
            receivableAmount: 0,
            amountPending: 0,
            status: 'pending' as const,
            currency: 'USD'
          };
        }
        
        return {
          id: item.id || `receivable_${index}`,
          created: item.created_at || item.created || new Date().toISOString().split('T')[0],
          invoiceNo: item.invoice?.reference_number || item.reference_number || `INV-${index + 1}`,
          partnerName: item.partner_name || item.partnerName || 'Unknown Partner',
          description: item.description || item.purpose_code || 'Receivable',
          receivableAmount: parseFloat(item.amount_maximum_reconcilable || item.amount || '0'),
          amountPending: parseFloat(item.amount_pending || item.amount || '0'),
          status: item.status || 'pending',
          currency: item.currency || 'USD'
        };
      });
      
      setReceivables(transformedData);
      if (transformedData.length > 0) {
        toast.success(`Successfully loaded ${transformedData.length} receivables`);
      } else {
        toast.info('No receivables found');
      }
    } catch (err: any) {
      console.error('Error fetching receivables:', err);
      const errorMessage = err.message || 'Failed to fetch receivables';
      toast.error(`${errorMessage}. Using mock data.`);
      // Fallback to mock data if API fails
      setReceivables(mockReceivables);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'paid': return 'success';
      case 'overdue': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleReconcile = (receivable: ReceivableItem) => {
    setSelectedReceivable(receivable);
    setReconcileAmount(receivable.amountPending.toString());
    setReconcileCurrency(receivable.currency);
    setReconcileModalOpen(true);
  };

  const handleCloseReconcileModal = () => {
    setReconcileModalOpen(false);
    setSelectedReceivable(null);
    setReconcileAmount('');
    setReconcileCurrency('USD');
  };

  const handleReconcileSubmit = () => {
    if (!selectedReceivable || !reconcileAmount) return;
    
    // Update the receivable status and amount pending
    setReceivables(prev => prev.map(item => 
      item.id === selectedReceivable.id 
        ? { 
            ...item, 
            amountPending: Math.max(0, item.amountPending - parseFloat(reconcileAmount)),
            status: item.amountPending - parseFloat(reconcileAmount) <= 0 ? 'paid' : item.status
          }
        : item
    ));
    
    toast.success('Receivable reconciled successfully!');
    handleCloseReconcileModal();
  };

  // Load receivables on component mount
  React.useEffect(() => {
    fetchReceivables();
  }, []);

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validate main fields
    if (!formData.account_id) {
      errors['account_id'] = 'Account ID is required';
    }

    if (!formData.amount_maximum_reconcilable) {
      errors['amount_maximum_reconcilable'] = 'Maximum reconcilable amount is required';
    } else if (isNaN(parseFloat(formData.amount_maximum_reconcilable)) || parseFloat(formData.amount_maximum_reconcilable) <= 0) {
      errors['amount_maximum_reconcilable'] = 'Please enter a valid amount';
    }

    if (!formData.currency) {
      errors['currency'] = 'Currency is required';
    }

    if (!formData.purpose_code) {
      errors['purpose_code'] = 'Purpose code is required';
    }

    if (!formData.transaction_type) {
      errors['transaction_type'] = 'Transaction type is required';
    }

    // Validate invoice fields
    if (!formData.invoice.amount) {
      errors['invoice.amount'] = 'Invoice amount is required';
    } else if (isNaN(parseFloat(formData.invoice.amount)) || parseFloat(formData.invoice.amount) <= 0) {
      errors['invoice.amount'] = 'Please enter a valid invoice amount';
    }

    if (!formData.invoice.creation_date) {
      errors['invoice.creation_date'] = 'Invoice creation date is required';
    }

    if (!formData.invoice.currency) {
      errors['invoice.currency'] = 'Invoice currency is required';
    }

    if (!formData.invoice.document) {
      errors['invoice.document'] = 'Document ID is required';
    }

    if (!formData.invoice.due_date) {
      errors['invoice.due_date'] = 'Invoice due date is required';
    }

    if (!formData.invoice.reference_number) {
      errors['invoice.reference_number'] = 'Reference number is required';
    }

    // Validate date logic
    if (formData.invoice.creation_date && formData.invoice.due_date) {
      const creationDate = new Date(formData.invoice.creation_date);
      const dueDate = new Date(formData.invoice.due_date);
      if (dueDate <= creationDate) {
        errors['invoice.due_date'] = 'Due date must be after creation date';
      }
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
      const response = await receivablesService.createReceivable(formData as ReceivablesData);
      
      toast.success(response.message || 'Receivable created successfully!');
      
      // Add new receivable to the table
      const newReceivable: ReceivableItem = {
        id: Date.now().toString(),
        created: new Date().toISOString().split('T')[0],
        invoiceNo: formData.invoice.reference_number,
        partnerName: formData.account_id,
        description: `${formData.transaction_type} - ${formData.purpose_code}`,
        receivableAmount: parseFloat(formData.amount_maximum_reconcilable),
        amountPending: parseFloat(formData.amount_maximum_reconcilable),
        status: 'pending',
        currency: formData.currency
      };

      setReceivables(prev => [newReceivable, ...prev]);

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
      setUploadedFileId(null);
      setIsUploading(false);
      setUploadProgress(0);
      setIsFormOpen(false);
      
    } catch (error: any) {
      console.error('Error creating receivable:', error);
      toast.error(error.message || 'Failed to create receivable. Please try again.');
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
      if (field.startsWith('invoice.')) {
        const invoiceField = field.split('.')[1];
        return formData.invoice[invoiceField as keyof typeof formData.invoice];
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
        InputLabelProps={{
          shrink: type === 'date' ? true : undefined,
        }}
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
      return (formData as any)[field];
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
      <div className="receivables-dashboard-container">
        {/* Header */}
        <Box className="dashboard-header">
          <Box>
            <Typography variant="h4" className="dashboard-title">
              Receivables Dashboard
            </Typography>
            <Typography variant="body1" className="dashboard-subtitle">
              Manage your receivables and track outstanding payments
            </Typography>
          </Box>
        </Box>

        {/* Create Receivable Button */}
        <Box className="create-button-section">
          <Button
            variant="contained"
            startIcon={isFormOpen ? <ExpandLess /> : <Add />}
            onClick={toggleForm}
            className="create-receivable-button"
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
            {isFormOpen ? 'Hide Create Form' : 'Create New Receivable'}
          </Button>
        </Box>

        {/* Collapsible Form */}
        <Collapse in={isFormOpen}>
          <Card className="form-card">
            <CardContent>
              <Box className="form-header">
                <Typography variant="h5" className="form-title">
                  Create Receivable
                </Typography>
                <Typography variant="body1" className="form-subtitle">
                  Fill in the details below to create a new receivable entry
                </Typography>
              </Box>

              <form onSubmit={handleSubmit} className="receivables-form">
              {/* Account Information Section */}
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  Account Information
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    {renderTextField('account_id', 'Account ID')}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {renderTextField('amount_maximum_reconcilable', 'Maximum Reconcilable Amount', 'number')}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {renderSelectField('currency', 'Currency', currencies)}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {renderSelectField('purpose_code', 'Purpose Code', purposeCodes)}
                  </Grid>
                  <Grid item xs={12}>
                    {renderSelectField('transaction_type', 'Transaction Type', transactionTypes)}
                  </Grid>
                </Grid>
              </Box>

              {/* Invoice Details Section */}
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  Invoice Details
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    {renderTextField('invoice.amount', 'Invoice Amount', 'number')}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {renderSelectField('invoice.currency', 'Invoice Currency', currencies)}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {renderTextField('invoice.creation_date', 'Creation Date', 'date')}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {renderTextField('invoice.due_date', 'Due Date', 'date')}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {renderTextField('invoice.reference_number', 'Reference Number')}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {renderTextField('invoice.document', 'Document ID')}
                  </Grid>
                </Grid>

                {/* File Upload Section */}
                <Box className="file-upload-section">
                  <Typography variant="h6" className="section-title" sx={{ marginBottom: '16px' }}>
                    Invoice File Upload
                  </Typography>
                  
                  {/* API Info */}
                  <Alert 
                    severity="info" 
                    sx={{ 
                      marginBottom: '16px',
                      backgroundColor: '#ebf8ff',
                      border: '1px solid #bee3f8',
                      '& .MuiAlert-icon': {
                        color: '#3182ce'
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#2c5282', marginBottom: '8px' }}>
                      Files are uploaded using curl-style integration to: <strong>http://43.205.26.213:7015/files</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#2c5282', fontFamily: 'monospace', display: 'block' }}>
                      Equivalent curl command:
                    </Typography>
                    <pre style={{ 
                      fontSize: '10px', 
                      backgroundColor: 'rgba(0,0,0,0.05)', 
                      padding: '4px', 
                      borderRadius: '4px',
                      margin: '4px 0',
                      overflow: 'auto'
                    }}>
                      {fileUploadService.getCurlCommand('your-file.pdf')}
                    </pre>
                  </Alert>

                  {/* Diagnostic Section */}
                  <Box sx={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleTestAPIConnection}
                      sx={{
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontSize: '12px',
                        borderColor: '#4299e1',
                        color: '#4299e1',
                        '&:hover': {
                          borderColor: '#3182ce',
                          backgroundColor: '#ebf8ff',
                        },
                      }}
                    >
                      🔗 Test API Connection
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      component="label"
                      sx={{
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontSize: '12px',
                        borderColor: '#38a169',
                        color: '#38a169',
                        '&:hover': {
                          borderColor: '#2f855a',
                          backgroundColor: '#f0fff4',
                        },
                      }}
                    >
                      🚀 Test Curl-Style Upload
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleTestCurlStyleUpload}
                      />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      component="label"
                      sx={{
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontSize: '12px',
                        borderColor: '#e53e3e',
                        color: '#e53e3e',
                        '&:hover': {
                          borderColor: '#c53030',
                          backgroundColor: '#fed7d7',
                        },
                      }}
                    >
                      🔍 Diagnose Upload Issue
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleDiagnoseUpload}
                      />
                    </Button>
                    <Typography variant="caption" sx={{ color: '#718096' }}>
                      Use these tools to debug file upload problems
                    </Typography>
                  </Box>

                  {/* Diagnostic Results */}
                  {diagnosticResult && (
                    <Alert 
                      severity={diagnosticResult.includes('success') ? 'success' : 'error'}
                      sx={{ 
                        marginBottom: '16px',
                        '& .MuiAlert-message': {
                          width: '100%'
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: '8px' }}>
                        Diagnostic Results:
                      </Typography>
                      <pre style={{ 
                        fontSize: '10px', 
                        whiteSpace: 'pre-wrap', 
                        wordBreak: 'break-word',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        padding: '8px',
                        borderRadius: '4px',
                        maxHeight: '200px',
                        overflow: 'auto'
                      }}>
                        {diagnosticResult}
                      </pre>
                    </Alert>
                  )}
                  
                  {!uploadedFile ? (
                    <Paper
                      className="file-upload-area"
                      sx={{
                        border: '2px dashed #cbd5e0',
                        borderRadius: '12px',
                        padding: '24px',
                        textAlign: 'center',
                        backgroundColor: '#f7fafc',
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: isUploading ? 0.6 : 1,
                        '&:hover': {
                          borderColor: isUploading ? '#cbd5e0' : '#4299e1',
                          backgroundColor: isUploading ? '#f7fafc' : '#edf2f7',
                        },
                      }}
                      onClick={() => !isUploading && document.getElementById('file-upload-input')?.click()}
                    >
                      {isUploading ? (
                        <>
                          <CircularProgress sx={{ fontSize: 48, color: '#4299e1', marginBottom: '16px' }} />
                          <Typography variant="h6" sx={{ color: '#4a5568', marginBottom: '8px' }}>
                            Uploading File...
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#718096', marginBottom: '16px' }}>
                            Please wait while your file is being uploaded to the server
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#a0aec0' }}>
                            Upload Progress: {uploadProgress}%
                          </Typography>
                        </>
                      ) : (
                        <>
                          <CloudUpload sx={{ fontSize: 48, color: '#a0aec0', marginBottom: '16px' }} />
                          <Typography variant="h6" sx={{ color: '#4a5568', marginBottom: '8px' }}>
                            Upload Invoice File
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#718096', marginBottom: '16px' }}>
                            Click to browse or drag and drop your invoice file here
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#a0aec0' }}>
                            Supported formats: PDF, JPEG, PNG (Max 10MB)
                          </Typography>
                        </>
                      )}
                      <input
                        id="file-upload-input"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        style={{ display: 'none' }}
                      />
                    </Paper>
                  ) : (
                    <Paper
                      className="uploaded-file-display"
                      sx={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '16px',
                        backgroundColor: '#f7fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AttachFile sx={{ color: '#4299e1' }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#2d3748' }}>
                            {uploadedFile.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#718096' }}>
                            {formatFileSize(uploadedFile.size)} • {uploadedFile.type.split('/')[1].toUpperCase()}
                          </Typography>
                          {uploadedFileId && (
                            <Typography variant="caption" sx={{ color: '#4299e1', display: 'block', marginTop: '4px' }}>
                              File ID: {uploadedFileId}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Chip
                          label="Uploaded"
                          color="success"
                          size="small"
                          sx={{ fontSize: '10px' }}
                        />
                        <IconButton
                          onClick={handleRemoveFile}
                          size="small"
                          sx={{
                            color: '#e53e3e',
                            '&:hover': {
                              backgroundColor: '#fed7d7',
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Paper>
                  )}
                </Box>
              </Box>

              {/* Form Actions */}
              <Box className="form-actions">
                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    // Reset form to default values
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
                    setValidationErrors({});
                    setUploadedFile(null);
                    setUploadedFileId(null);
                    setIsUploading(false);
                    setUploadProgress(0);
                  }}
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
                  Reset Form
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
                      Creating Receivable...
                    </>
                  ) : (
                    'Create Receivable'
                  )}
                </Button>
              </Box>
              </form>
            </CardContent>
          </Card>
        </Collapse>

        {/* Receivables Table */}
        <Card className="table-card">
          <CardContent>
            <Box className="table-header">
              <Typography variant="h5" className="table-title">
                Receivables
              </Typography>
              <Button
                variant="outlined"
                onClick={fetchReceivables}
                disabled={loading}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                }}
              >
                {loading ? <CircularProgress size={20} /> : 'Refresh'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  console.log('Testing API call...');
                  fetchReceivables();
                }}
                disabled={loading}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  marginLeft: '8px',
                }}
              >
                Test API
              </Button>
            </Box>

            <TableContainer component={Paper} className="table-container">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Created</TableCell>
                    <TableCell>Invoice No.</TableCell>
                    <TableCell>Partner Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Receivable Amount</TableCell>
                    <TableCell>Amount Pending</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {receivables.map((receivable) => (
                    <TableRow key={receivable.id} className="table-row">
                      <TableCell>{formatDate(receivable.created)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" className="invoice-number">
                          {receivable.invoiceNo}
                        </Typography>
                      </TableCell>
                      <TableCell>{receivable.partnerName}</TableCell>
                      <TableCell>
                        <Typography variant="body2" className="description">
                          {receivable.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="amount">
                          {formatCurrency(receivable.receivableAmount, receivable.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="amount">
                          {formatCurrency(receivable.amountPending, receivable.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={receivable.status.charAt(0).toUpperCase() + receivable.status.slice(1)}
                          color={getStatusColor(receivable.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AccountBalance />}
                          onClick={() => handleReconcile(receivable)}
                          disabled={receivable.status === 'paid' || receivable.amountPending === 0}
                          sx={{
                            borderRadius: '6px',
                            textTransform: 'none',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderColor: '#4299e1',
                            color: '#4299e1',
                            '&:hover': {
                              borderColor: '#3182ce',
                              backgroundColor: '#ebf8ff',
                            },
                            '&:disabled': {
                              borderColor: '#e2e8f0',
                              color: '#a0aec0',
                            },
                          }}
                        >
                          Reconcile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {receivables.length === 0 && !loading && (
              <Box className="empty-state">
                <Typography variant="h6" color="textSecondary">
                  No receivables found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Create your first receivable to get started
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Reconciliation Modal */}
        <Dialog 
          open={reconcileModalOpen} 
          onClose={handleCloseReconcileModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '24px 24px 0 24px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a202c' }}>
                You are reconciling {selectedReceivable?.currency} payments received in Common Balance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Box sx={{ 
                backgroundColor: '#f7fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px', 
                padding: '8px 12px' 
              }}>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  Common Balance: {selectedReceivable?.currency} {selectedReceivable?.amountPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
              <IconButton 
                onClick={handleCloseReconcileModal}
                sx={{ 
                  color: '#718096',
                  '&:hover': { backgroundColor: '#f7fafc' }
                }}
              >
                ✕
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ padding: '24px' }}>
            {/* Invoice Reconciliation Input Section */}
            <Card sx={{ 
              backgroundColor: '#f7fafc', 
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <CardContent sx={{ padding: '20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <Typography variant="body2" sx={{ color: '#4a5568' }}>
                    Enter amount to reconcile
                  </Typography>
                  <Link 
                    component="button" 
                    variant="body2" 
                    onClick={() => setReconcileAmount(selectedReceivable?.amountPending.toString() || '')}
                    sx={{ 
                      color: '#4299e1', 
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Reset
                  </Link>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>
                      {selectedReceivable?.invoiceNo}
                    </Typography>
                    <Link sx={{ color: '#4299e1', fontSize: '14px' }}>🔗</Link>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#718096' }}>
                    Amount Pending: {selectedReceivable?.currency} {selectedReceivable?.amountPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                  <FormControl size="small" sx={{ minWidth: '80px' }}>
                    <Select
                      value={reconcileCurrency}
                      onChange={(e) => setReconcileCurrency(e.target.value)}
                      sx={{
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
                      {currencies.map((currency) => (
                        <MenuItem key={currency.value} value={currency.value}>
                          {currency.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    type="number"
                    value={reconcileAmount}
                    onChange={(e) => setReconcileAmount(e.target.value)}
                    inputProps={{ 
                      min: 0, 
                      max: selectedReceivable?.amountPending,
                      step: 0.01 
                    }}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
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
                    }}
                  />
                  
                  <IconButton 
                    size="small"
                    sx={{ 
                      color: '#e53e3e',
                      '&:hover': { backgroundColor: '#fed7d7' }
                    }}
                  >
                    🗑️
                  </IconButton>
                </Box>
              </CardContent>
            </Card>

            {/* Payout Details Section */}
            <Card sx={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <CardContent sx={{ padding: '20px' }}>
                <Typography variant="h6" sx={{ marginBottom: '16px', color: '#1a202c' }}>
                  Payout Details
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>Gross Amount:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {reconcileCurrency} {parseFloat(reconcileAmount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>Payout Fee:</Typography>
                    <Typography variant="body2" sx={{ color: '#e53e3e', fontWeight: 500 }}>
                      -{reconcileCurrency} {(parseFloat(reconcileAmount || '0') * 0.75).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>Net Amount:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {reconcileCurrency} {(parseFloat(reconcileAmount || '0') * 0.25).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>FX ({reconcileCurrency} 1.00):</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      INR 87.85166
                    </Typography>
                  </Box>
                </Box>

                <Alert 
                  severity="info" 
                  sx={{ 
                    marginTop: '16px',
                    backgroundColor: '#ebf8ff',
                    border: '1px solid #bee3f8',
                    '& .MuiAlert-icon': {
                      color: '#3182ce'
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#2c5282' }}>
                    Your payout will be processed at the last available FX rate since a more recent rate is currently not available from the banking partner. Hover over the FX rate to see the timestamp of the current FX rate being offered.
                  </Typography>
                </Alert>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '16px',
                  padding: '12px 0',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a202c' }}>
                    Payout Amount
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a202c' }}>
                    INR {(parseFloat(reconcileAmount || '0') * 0.25 * 87.85166).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Payout Summary Section */}
            <Card sx={{ 
              backgroundColor: '#f7fafc', 
              border: '1px solid #e2e8f0',
              borderRadius: '12px'
            }}>
              <CardContent sx={{ padding: '20px' }}>
                <Typography variant="h6" sx={{ marginBottom: '16px', color: '#1a202c' }}>
                  Payout Summary
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>Bank Account:</Typography>
                    <Typography variant="body2" sx={{ color: '#e53e3e' }}>
                      Ending with undefined
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>Payout Date:</Typography>
                    <Typography variant="body2" sx={{ color: '#e53e3e' }}>
                      Invalid date
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </DialogContent>

          <DialogActions sx={{ 
            padding: '16px 24px 24px 24px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <Button
              onClick={handleCloseReconcileModal}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                padding: '8px 16px',
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
              onClick={handleReconcileSubmit}
              variant="contained"
              disabled={!reconcileAmount || parseFloat(reconcileAmount) <= 0}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                padding: '8px 16px',
                backgroundColor: '#4299e1',
                '&:hover': {
                  backgroundColor: '#3182ce',
                },
                '&:disabled': {
                  backgroundColor: '#a0aec0',
                },
              }}
            >
              Process Reconciliation
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default RecievablesDashboard;