# File Upload API Integration for Receivables

## Overview
The file upload API has been integrated into the receivables forms to allow users to upload invoice documents directly to the server using the `POST /files` endpoint.

## Integration Details

### API Endpoint
- **URL**: `POST http://43.205.26.213:7015/files`
- **Headers**: `Xflow-Account: account_F0A_1759166669125_GuHWS_000`
- **Content-Type**: `multipart/form-data`

### File Upload Service
The `fileUploadService` handles:
- File validation (JPEG, PNG, PDF, max 10MB)
- API communication with proper error handling
- Metadata attachment for document categorization

### Integrated Components

#### 1. ReceivablesFormModal
- **Location**: `src/components/Receivables/ReceivablesFormModal.tsx`
- **Features**: 
  - Real-time upload progress
  - File ID storage in form data
  - View uploaded file link
  - Error handling with user feedback

#### 2. RecievablesDashboard
- **Location**: `src/components/Receivables/RecievablesDashboard.tsx`
- **Features**:
  - Drag & drop file upload
  - Upload progress indicator
  - File information display with ID
  - Direct file viewing capability

#### 3. StepByStepPaymentForm
- **Location**: `src/components/Receivables/StepByStepPaymentForm.tsx`
- **Features**:
  - Step-by-step form with file upload
  - Progress tracking
  - File validation and error handling

### File Upload Flow

1. **User selects file** → File validation (type, size)
2. **Upload to API** → `POST /files` with metadata
3. **Store file ID** → Replace filename with file ID in form
4. **Display success** → Show file info with view link
5. **Form submission** → Include file ID in receivable data

### File Metadata
Each uploaded file includes:
```json
{
  "purpose": "transactional_document",
  "metadata": {
    "document_type": "invoice",
    "reference_number": "INV-2024-001"
  }
}
```

### Supported File Types
- **Formats**: JPEG, PNG, PDF
- **Max Size**: 10MB per file
- **Purpose**: `finance_document` (for invoices)
- **Important**: The API is strict about file types - only these exact formats are accepted

### Error Handling
- File type validation (strict - only PDF, JPEG, PNG)
- File extension validation (must match MIME type)
- File size validation (10MB limit)
- Network error handling
- Server error handling
- User-friendly error messages with specific guidance

### Common Issues and Solutions
- **400 Error**: Usually means unsupported file type or extension mismatch
- **500 Error**: Usually means wrong field names in the request
- **File Extension Mismatch**: Ensure .pdf files have MIME type application/pdf, .jpg files have image/jpeg, etc.

### UI Enhancements
- Upload progress indicators
- File ID display
- Direct file viewing links
- Success/error state indicators
- Disabled states during upload

## Usage Example

When a user uploads an invoice file:
1. File is validated locally
2. Uploaded to the API with metadata
3. File ID is stored in the form's `invoice.document` field
4. User can view the uploaded file via the provided URL
5. Form submission includes the file ID for processing

## Benefits
- **Secure**: Files are uploaded to a secure server
- **Traceable**: Each file has a unique ID for tracking
- **Accessible**: Users can view uploaded files anytime
- **Validated**: Proper file type and size validation
- **User-friendly**: Clear progress indicators and error messages
