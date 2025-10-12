# File Upload Debug Center

## Overview
The File Upload Debug Center is a comprehensive tool to help diagnose and fix file upload issues in the PayDirect application.

## Access Methods

### 1. Direct URL
- Navigate to: `/debug-file-upload`
- Or: `/debug` (redirects to the main debug page)

### 2. Sidebar Navigation
- Click on "File Upload Debug" in the left sidebar
- Icon: 🐛 (bug icon)

### 3. From Receivables Forms
- Click the "🐛 Debug File Upload" button in the Receivables Dashboard
- Click the "🐛 Debug" button in the Create Receivable modal

## Debug Tools Available

### 1. File Diagnostic Tool
**Purpose**: Analyze your file and identify issues before upload
**Features**:
- Validates file name, size, type, and extension
- Checks if extension matches MIME type
- Provides specific recommendations
- Shows detailed file information

### 2. File Validator
**Purpose**: Basic file validation
**Features**:
- Checks file format compliance
- Validates file size limits
- Shows validation results with icons

### 3. Upload Test
**Purpose**: Test actual file uploads
**Features**:
- Tests API connection
- Tests with generated PDF files
- Tests with your specific files
- Shows detailed upload results

### 4. API Test
**Purpose**: Direct API testing
**Features**:
- Tests API endpoints directly
- Bypasses the file upload service
- Shows raw API responses

### 5. cURL Test
**Purpose**: Command-line testing examples
**Features**:
- Shows working cURL commands
- Provides copy-paste examples
- Documents expected responses

## Common Issues and Solutions

### 400 Bad Request Error
**Causes**:
- Unsupported file type (only PDF, JPEG, PNG allowed)
- File extension doesn't match MIME type
- Corrupted or empty file
- File too large (>10MB)

**Solutions**:
1. Use File Diagnostic tool to identify the issue
2. Rename file to match its actual type
3. Convert file to supported format
4. Check file size and integrity

### File Type Issues
**Supported Types**:
- PDF: `application/pdf` with `.pdf` extension
- JPEG: `image/jpeg` with `.jpg` or `.jpeg` extension
- PNG: `image/png` with `.png` extension

**Common Problems**:
- `.pdf` file with `image/jpeg` MIME type
- `.jpg` file with `application/pdf` MIME type
- Generic `application/octet-stream` MIME type

## API Requirements

### Endpoint
- URL: `POST http://43.205.26.213:7015/files`
- Headers: `Xflow-Account: account_F0A_1759166669125_GuHWS_000`

### Request Format
```
Content-Type: multipart/form-data
Fields:
- file: [binary file data]
- purpose: finance_document
```

### Response Format
**Success (201)**:
```json
{
  "created": 1760267939,
  "file_name": "document.pdf",
  "id": "file_F0A_1760267939801_Nmqyx_000",
  "livemode": false,
  "metadata": null,
  "object": "file",
  "purpose": "finance_document",
  "size": 13,
  "type": "pdf",
  "url": "https://api.xflowpay.com/v1/files/file_F0A_1760267939801_Nmqyx_000/contents"
}
```

**Error (400)**:
```json
{
  "error": "Request failed with status code 400"
}
```

## Usage Workflow

1. **Start with File Diagnostic** - Select your problematic file
2. **Review the analysis** - Check for issues and warnings
3. **Fix identified problems** - Follow the recommendations
4. **Test with Upload Test** - Try uploading the fixed file
5. **Use API Test if needed** - For advanced debugging
6. **Check cURL examples** - For command-line testing

## Tips for Success

- Always validate your file before attempting upload
- Ensure file extension matches MIME type exactly
- Use supported file formats only
- Keep files under 10MB
- Test with the generated PDF first to verify API connectivity
- Check browser console for detailed error logs

## Support

If you continue to have issues after using these debug tools:
1. Check the browser console for detailed error logs
2. Try the cURL command examples
3. Verify your file meets all requirements
4. Test with a known good file (use the generated PDF test)

