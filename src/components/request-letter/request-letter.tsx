import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateLetter, RequestLetterFormData } from '@/app/redux/slices/api/requestLetterSlice';
import styles from './request-letter.module.css';
import type { RootState } from '@/app/redux/store';
import { toast, ToastContainer } from 'react-toastify';
import { AppDispatch } from '@/app/redux/store';
import { 
  Select, 
  MenuItem, 
  Box, 
  Typography, 
  Avatar,
  TextField,
  InputAdornment,
  Button,
  CircularProgress
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface GenerateLetterResponse {
  pdfUrl: string;
  message: string;
}

const RequestLetter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.requestLetter);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  
  const currencies = [
    { code: "USD", name: "United States Dollar" },
    { code: "INR", name: "Indian Rupee" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
  ];

  const getFlagUrl = (code: string): string =>
    `https://wise.com/public-resources/assets/flags/rectangle/${code.toLowerCase()}.png`;

  const [formData, setFormData] = useState<RequestLetterFormData>({
    // Original form fields
    date: new Date().toISOString().split('T')[0],
    hsn_code: '',
    shipment_from: '',
    shipment_to: '',
    country_of_origin: '',
    tentative_shipment_date: '',
    amount: '',
    currency: 'USD',
    remitter_address: '',
    beneficiary_name: '',
    beneficiary_address: '',
    beneficiary_account: '',
    bank_name: '',
    bank_address: '',
    swift_code: '',
    transaction_details: '',
    foreign_bank_charges: '',
    debit_inr_ac: '',
    signatory_name: '',

    // Additional API fields (with default values)
    branch_name: '',
    client_name: '',
    address: '',
    amount_in_words: '',
    goods_description: '',
    country_of_shipment: '',
    port_of_discharge: '',
    invoice_number: '',
    invoice_date: new Date().toISOString().split('T')[0],
    invoice_value: '',
    igst_applicable: 'No',
    tax_note: '',
    declaration_place: '',
    declaration_date: new Date().toISOString().split('T')[0],
    declaration_signed_by: '',
    deal_reference: '',
    fx_rate_booked: false,
    value_date: new Date().toISOString().split('T')[0],
    debit_eefc_ac: '',
    debit_our_ac: '',
    reason_not_taxable: '',
    documents_enclosed: [
      'Proforma Invoice of the Supplier/ Purchase order duly certified by the applicant'
    ],
    signatory_stamp: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    // Only validate the fields that are shown in the UI
    const requiredFields = [
      'date',
      'hsn_code',
      'shipment_from',
      'shipment_to',
      'country_of_origin',
      'tentative_shipment_date',
      'amount',
      'currency',
      'remitter_address',
      'beneficiary_name',
      'beneficiary_address',
      'beneficiary_account',
      'bank_name',
      'bank_address',
      'swift_code',
      'transaction_details',
      'foreign_bank_charges',
      'debit_inr_ac',
      'signatory_name'
    ];

    // Check required fields
    requiredFields.forEach(field => {
      const value = formData[field as keyof RequestLetterFormData];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors[field] = 'This field is required';
      }
    });

    // Validate numeric fields
    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      errors.amount = 'Please enter a valid amount';
    }

    // Validate account number
    if (!/^\d{9,35}$/.test(formData.debit_inr_ac)) {
      errors.debit_inr_ac = 'Please enter a valid account number (9-35 digits)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    // Map form fields to API fields before submission
    const apiFormData = {
      ...formData,
      // Map original fields to their API counterparts
      country_of_shipment: formData.shipment_from,
      port_of_discharge: formData.shipment_to,
      amount_in_words: `${formData.amount} ${formData.currency}`,
      declaration_signed_by: formData.signatory_name,
      declaration_date: formData.date,
      value_date: formData.date,
      invoice_value: formData.amount,
      goods_description: 'As per invoice',
      client_name: formData.remitter_address.split('\n')[0], // First line of remitter address
    };

    try {
      const response = await dispatch(generateLetter(apiFormData)).unwrap();
      
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = `request_letter_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Letter generated and downloaded successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate letter. Please try again.');
    }
  };

  const renderInput = (
    name: keyof RequestLetterFormData,
    label: string,
    type: string = 'text',
    required: boolean = true,
    min?: string,
    step?: string
  ) => {
    if (type === 'date') {
      return renderDateInput(name, label);
    }

    return (
      <div className={styles.inputGroupBorder}>
        <TextField
          fullWidth
          type={type}
          name={name}
          label={label}
          value={formData[name]}
          onChange={handleInputChange}
          required={required}
          inputProps={{
            min: min,
            step: step
          }}
          error={!!validationErrors[name]}
          helperText={validationErrors[name]}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: '#fff',
              width: '100%',
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
            width: '100%',
            marginBottom: '16px'
          }}
        />
      </div>
    );
  };

  const renderDateInput = (name: keyof RequestLetterFormData, label: string) => {
    return (
      <div className={styles.inputGroupBorder}>
        <TextField
          fullWidth
          type="date"
          name={name}
          label={label}
          value={formData[name]}
          onChange={handleInputChange}
          required
          error={!!validationErrors[name]}
          helperText={validationErrors[name]}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: '#fff',
              width: '100%',
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
            width: '100%',
            marginBottom: '16px'
          }}
        />
      </div>
    );
  };

  const renderCurrencySelect = () => {
    return (
      <div className={styles.inputGroupBorder}>
        <TextField
          select
          fullWidth
          label="Currency"
          value={formData.currency}
          onChange={(e) => handleInputChange({
            target: { name: 'currency', value: e.target.value }
          } as React.ChangeEvent<HTMLSelectElement>)}
          error={!!validationErrors.currency}
          helperText={validationErrors.currency}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: '#fff',
              width: '100%',
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
            width: '100%',
            marginBottom: '16px'
          }}
        >
          {currencies.map((currency) => (
            <MenuItem
              key={currency.code}
              value={currency.code}
              sx={{
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
                "&.Mui-selected": {
                  backgroundColor: "#e0e0e0",
                  fontWeight: "bold",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                  src={getFlagUrl(currency.code)}
                  sx={{ width: 24, height: 24 }}
                />
                <Typography>{currency.code}</Typography>
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </div>
    );
  };

  return (
    <>
    <ToastContainer />
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.requestForm}>
        <div className={styles.formSection}>
          <h3>Basic Details</h3>
          {renderDateInput('date', 'Date')}
          {renderInput('hsn_code', 'H.S. Code')}
          {renderInput('amount', 'Amount to be remitted', 'number')}
          {renderCurrencySelect()}
        </div>

        <div className={styles.formSection}>
          <h3>Shipment Details</h3>
          {renderInput('shipment_from', 'Shipment from')}
          {renderInput('shipment_to', 'Shipment to')}
          {renderInput('country_of_origin', 'Country of origin')}
          {renderDateInput('tentative_shipment_date', 'Tentative date of shipment')}
        </div>

        <div className={styles.formSection}>
          <h3>Remitter Details</h3>
          {renderInput('remitter_address', "Remitter's name and address")}
        </div>

        <div className={styles.formSection}>
          <h3>Beneficiary Details</h3>
          {renderInput('beneficiary_name', 'Beneficiary name')}
          {renderInput('beneficiary_address', 'Beneficiary address')}
          {renderInput('beneficiary_account', 'Beneficiary account number')}
        </div>

        <div className={styles.formSection}>
          <h3>Bank Details</h3>
          {renderInput('bank_name', "Banker's name")}
          {renderInput('bank_address', 'Bank Address')}
          {renderInput('swift_code', 'Swift Code')}
          {renderInput('foreign_bank_charges', "Foreign Bank's Charges")}
        </div>

        <div className={styles.formSection}>
          <h3>Transaction Details</h3>
          {renderInput('transaction_details', 'Purpose of remittance')}
          {renderInput('debit_inr_ac', 'Debit INR a/c no')}
        </div>

        <div className={styles.formSection}>
          <h3>Authorization</h3>
          {renderInput('signatory_name', 'Authorized Signatory Name')}
        </div>

        <div className={styles.formActions}>
          <Button
            type="submit"
            variant="contained"
            disabled={status === 'loading'}
            startIcon={status === 'loading' ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <PictureAsPdfIcon />
            )}
            sx={{
              backgroundColor: '#004080',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#003366',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              },
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {status === 'loading' ? 'Generating...' : 'Generate Letter'}
          </Button>
        </div>
      </form>
    </div>
    </>
  );
};

export default RequestLetter; 