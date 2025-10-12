import axios from 'axios';

export interface FileUploadData {
  file: File;
  purpose: FilePurpose;
  metadata?: {
    // document_type?: string;
    // reference_number?: string;
    purpose?: FilePurpose;
    [key: string]: any;
  };
}

export type FilePurpose = 
//   | 'additional_verification'
  | 'finance_document'
//   | 'identity_document'
//   | 'logo'
//   | 'payout_confirmation'
//   | 'tax_document'
//   | 'transactional_document';

export interface FileUploadResponse {
  id: string;
  filename: string;
  purpose: FilePurpose;
  type: string;
  size: number;
  url: string;
  expires_at: number;
  account_id: string;
  metadata?: {
    // document_type?: string;
    // reference_number?: string;
    purpose?: FilePurpose;

    [key: string]: any;
  };
}

class FileUploadService {
  private baseURL: string;
  private accountHeader: string;

  constructor() {
    this.baseURL = 'http://43.205.26.213:7015';
    this.accountHeader = 'account_F0A_1759166669125_GuHWS_000';
  }

  /**
   * Upload a file to the server - using curl-style integration
   * @param fileData - The file and metadata to upload
   * @returns Promise with the upload response
   */
  async uploadFile(fileData: FileUploadData): Promise<FileUploadResponse> {
    try {
      // Basic file validation
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(fileData.file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.');
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (fileData.file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 10MB.');
      }

      // Use the curl-style upload method (matches the working curl command)
      return await this.uploadFileCurlStyle(fileData.file);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Error response headers:', error.response?.headers);
      console.error('Request URL:', `${this.baseURL}/files`);
      console.error('Request headers:', {
        'Xflow-Account': this.accountHeader
      });
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Invalid file or request parameters';
        let fullError = `Bad Request (400): ${errorMessage}`;
        
        // Check for specific body validation errors
        if (errorMessage.toLowerCase().includes('body invalid') || 
            errorMessage.toLowerCase().includes('invalid body') ||
            errorMessage.toLowerCase().includes('malformed')) {
          fullError = `Server body invalid error. This usually means:\n1. The FormData structure is incorrect\n2. The file is corrupted or invalid\n3. The server expects a different format\n4. Missing required fields\n\nTry using the clean upload method or check your file.`;
        } else if (errorMessage.toLowerCase().includes('parameter value invalid') ||
                   errorMessage.toLowerCase().includes('invalid parameter') ||
                   errorMessage.toLowerCase().includes('parameter invalid')) {
          fullError = `Parameter value invalid error. This usually means:\n1. The 'purpose' parameter value is not accepted by the server\n2. The server expects different parameter names or values\n3. Some parameters are required but missing\n4. Parameter format is incorrect\n\nTry using the clean upload method (file only) or test different parameter combinations.`;
        } else if (errorMessage.includes('Request failed with status code 400')) {
          fullError = `File upload failed. The API rejected your file. This usually means:\n1. The file type is not supported (only PDF, JPEG, PNG are allowed)\n2. The file extension doesn't match the file type\n3. The file is corrupted or invalid\n\nPlease try with a different file.`;
        }
        
        fullError += `\n\nFull response: ${JSON.stringify(error.response?.data, null, 2)}`;
        console.error('Full 400 error details:', fullError);
        throw new Error(fullError);
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized: Invalid account credentials');
      } else if (error.response?.status === 413) {
        throw new Error('File too large. Please choose a smaller file.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error: Please try again later');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout. Please try again.');
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        throw new Error('Network error: Unable to connect to the file upload service. The server may be down or unreachable.');
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Connection refused')) {
        throw new Error('Server is not reachable. The API server may be down or the URL is incorrect.');
      } else if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo ENOTFOUND')) {
        throw new Error('Cannot resolve server address. Check if the API URL is correct.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to upload file. Please try again.');
      }
    }
  }

  /**
   * Test the API connection
   * @returns Promise with connection status
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      // Try the health endpoint first
      const healthResponse = await axios.get(`${this.baseURL}/health`, {
        headers: {
          'Xflow-Account': this.accountHeader,
        },
        timeout: 10000,
      });
      
      return {
        success: true,
        message: `API connection successful. Health endpoint responded with status: ${healthResponse.status}`
      };
    } catch (error: any) {
      console.error('Health endpoint test failed:', error);
      
      // If health endpoint fails, try the files endpoint directly
      try {
        const filesResponse = await axios.get(`${this.baseURL}/files`, {
          headers: {
            'Xflow-Account': this.accountHeader,
          },
          timeout: 10000,
        });
        
        return {
          success: true,
          message: `Files endpoint accessible. Status: ${filesResponse.status}`
        };
      } catch (filesError: any) {
        console.error('Files endpoint test failed:', filesError);
        
        // Provide specific error messages based on error type
        if (filesError.code === 'ECONNREFUSED' || filesError.message.includes('Connection refused')) {
          return {
            success: false,
            message: 'Server is not reachable. The API server may be down or the URL is incorrect.'
          };
        } else if (filesError.code === 'ENOTFOUND' || filesError.message.includes('getaddrinfo ENOTFOUND')) {
          return {
            success: false,
            message: 'Cannot resolve server address. Check if the API URL is correct.'
          };
        } else if (filesError.code === 'ECONNABORTED' || filesError.message.includes('timeout')) {
          return {
            success: false,
            message: 'Connection timeout. The server is taking too long to respond.'
          };
        } else if (filesError.message.includes('Network Error')) {
          return {
            success: false,
            message: 'Network error. Check your internet connection and try again.'
          };
        } else if (filesError.response?.status === 405) {
          return {
            success: true,
            message: 'Files endpoint exists (Method Not Allowed for GET is expected)'
          };
        } else {
          return {
            success: false,
            message: `API connection failed. Health: ${error.response?.status || error.message}, Files: ${filesError.response?.status || filesError.message}`
          };
        }
      }
    }
  }

  /**
   * Test if the files endpoint exists
   * @returns Promise with endpoint status
   */
  async testFilesEndpoint(): Promise<{ success: boolean; message: string }> {
    try {
      // Try a simple GET request to see if the endpoint exists
      const response = await axios.get(`${this.baseURL}/files`, {
        headers: {
          'Xflow-Account': this.accountHeader,
        },
        timeout: 5000,
      });
      
      return {
        success: true,
        message: 'Files endpoint accessible'
      };
    } catch (error: any) {
      console.error('Files endpoint test failed:', error);
      if (error.response?.status === 405) {
        return {
          success: true,
          message: 'Files endpoint exists (Method Not Allowed for GET is expected)'
        };
      }
      return {
        success: false,
        message: `Files endpoint test failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`
      };
    }
  }

  /**
   * Test file upload with minimal data
   * @param file - Test file
   * @returns Promise with test result
   */
  async testUpload(file: File): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'finance_document');

      console.log('Testing upload with file and purpose parameter...');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `${value.name} (${value.size} bytes, ${value.type})` : value);
      }
      
      const response = await axios.post(`${this.baseURL}/files`, formData, {
        headers: {
          'Xflow-Account': this.accountHeader,
        },
        timeout: 30000,
      });

      return {
        success: true,
        message: 'Test upload successful',
        data: response.data
      };
    } catch (error: any) {
      console.error('Test upload failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Test upload failed',
        data: error.response?.data
      };
    }
  }

  /**
   * Test file upload with only file (no purpose)
   * @param file - Test file
   * @returns Promise with test result
   */
  async testUploadMinimal(file: File): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Testing upload with only file (no purpose)...');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await axios.post(`${this.baseURL}/files`, formData, {
        headers: {
          'Xflow-Account': this.accountHeader,
        },
        timeout: 30000,
      });

      return {
        success: true,
        message: 'Minimal test upload successful',
        data: response.data
      };
    } catch (error: any) {
      console.error('Minimal test upload failed:', error);
      console.error('Error response data:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Minimal test upload failed',
        data: error.response?.data
      };
    }
  }

  /**
   * Create a test file for testing
   * @returns Test file
   */
  createTestFile(): File {
    const content = 'This is a test file for API testing.';
    return new File([content], 'test.txt', { type: 'text/plain' });
  }

  /**
   * Test with a simple text file
   * @returns Promise with test result
   */
  async testWithTextFile(): Promise<{ success: boolean; message: string; data?: any }> {
    const testFile = this.createTestFile();
    return this.testUploadMinimal(testFile);
  }

  /**
   * Create a test PDF file (simple text content)
   * @returns Test PDF file
   */
  createTestPDFFile(): File {
    // Create a simple text content that could be a PDF
    const content = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF';
    return new File([content], 'test.pdf', { type: 'application/pdf' });
  }

  /**
   * Get the exact curl command that would be used for a file upload
   * @param fileName - Name of the file
   * @returns The curl command string
   */
  getCurlCommand(fileName: string): string {
    return `curl --location '${this.baseURL}/files' \\
--header 'Xflow-Account: ${this.accountHeader}' \\
--form 'file=@"${fileName}"' \\
--form 'purpose="finance_document"'`;
  }

  /**
   * Test with a known good PDF file
   * @returns Promise with test result
   */
  async testWithPDFFile(): Promise<{ success: boolean; message: string; data?: any }> {
    const testFile = this.createTestPDFFile();
    return this.testUpload(testFile);
  }

  /**
   * Test clean upload method (file only)
   * @param file - File to test
   * @returns Promise with test result
   */
  async testCleanUpload(file: File): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const result = await this.uploadFileClean(file);
      return {
        success: true,
        message: 'Clean upload successful',
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Clean upload failed',
        data: null
      };
    }
  }

  /**
   * Test different parameter combinations to identify valid parameters
   * @param file - File to test
   * @returns Promise with test results
   */
  async testParameterCombinations(file: File): Promise<{ success: boolean; message: string; results: any }> {
    const results: any = {};
    
    // Test 1: File only (no parameters)
    try {
      const formData1 = new FormData();
      formData1.append('file', file);
      
      const response1 = await axios.post(`${this.baseURL}/files`, formData1, {
        headers: { 'Xflow-Account': this.accountHeader },
        timeout: 10000,
      });
      
      results.fileOnly = { success: true, data: response1.data };
    } catch (error: any) {
      results.fileOnly = { 
        success: false, 
        error: error.response?.data?.message || error.message,
        status: error.response?.status 
      };
    }

    // Test 2: File with purpose parameter
    try {
      const formData2 = new FormData();
      formData2.append('file', file);
      formData2.append('purpose', 'finance_document');
      
      const response2 = await axios.post(`${this.baseURL}/files`, formData2, {
        headers: { 'Xflow-Account': this.accountHeader },
        timeout: 10000,
      });
      
      results.fileWithPurpose = { success: true, data: response2.data };
    } catch (error: any) {
      results.fileWithPurpose = { 
        success: false, 
        error: error.response?.data?.message || error.message,
        status: error.response?.status 
      };
    }

    // Test 3: File with different purpose values
    const purposeValues = ['document', 'file', 'upload', 'attachment'];
    for (const purpose of purposeValues) {
      try {
        const formData3 = new FormData();
        formData3.append('file', file);
        formData3.append('purpose', purpose);
        
        const response3 = await axios.post(`${this.baseURL}/files`, formData3, {
          headers: { 'Xflow-Account': this.accountHeader },
          timeout: 10000,
        });
        
        results[`fileWithPurpose_${purpose}`] = { success: true, data: response3.data };
        break; // If one works, we found the right parameter
      } catch (error: any) {
        results[`fileWithPurpose_${purpose}`] = { 
          success: false, 
          error: error.response?.data?.message || error.message,
          status: error.response?.status 
        };
      }
    }

    // Determine which test succeeded
    const successfulTest = Object.keys(results).find(key => results[key].success);
    
    return {
      success: !!successfulTest,
      message: successfulTest ? `Successful with: ${successfulTest}` : 'All parameter combinations failed',
      results: results
    };
  }

  /**
   * Clean upload method - file only (most reliable)
   * @param file - File to upload
   * @returns Promise with upload response
   */
  async uploadFileClean(file: File): Promise<FileUploadResponse> {
    try {
      console.log('=== CLEAN FILE UPLOAD ===');
      console.log('File info:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      // Create FormData with ONLY the file (no extra fields)
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `${value.name} (${value.size} bytes, ${value.type})` : value);
      }
      
      const response = await axios.post(`${this.baseURL}/files`, formData, {
        headers: {
          'Xflow-Account': this.accountHeader,
          // Don't set Content-Type - let axios set it automatically with boundary
        },
        timeout: 30000,
      });

      console.log('Clean upload successful:', response.data);
      console.log('=== END CLEAN UPLOAD ===');
      
      return response.data;
    } catch (error: any) {
      console.error('Clean upload failed:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Error response headers:', error.response?.headers);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Bad Request';
        throw new Error(`File upload failed (400): ${errorMessage}`);
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized: Invalid account credentials');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error: Please try again later');
      } else {
        throw new Error(error.message || 'Failed to upload file');
      }
    }
  }

  /**
   * Upload file exactly like the curl command
   * curl --location 'http://43.205.26.213:7015/files' \
   * --header 'Xflow-Account: account_F0A_1759166669125_GuHWS_000' \
   * --form 'file=@"/path/to/file"' \
   * --form 'purpose="finance_document"'
   * @param file - File to upload
   * @returns Promise with upload response
   */
  async uploadFileCurlStyle(file: File): Promise<FileUploadResponse> {
    try {
      console.log('=== CURL-STYLE FILE UPLOAD ===');
      console.log('Mimicking curl command:');
      console.log(`curl --location '${this.baseURL}/files' \\`);
      console.log(`--header 'Xflow-Account: ${this.accountHeader}' \\`);
      console.log(`--form 'file=@"${file.name}"' \\`);
      console.log(`--form 'purpose="finance_document"'`);
      
      // Create FormData exactly like curl --form
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'finance_document');
      
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `${value.name} (${value.size} bytes, ${value.type})` : value);
      }
      
      // Make the request exactly like the curl command
      const response = await axios.post(`${this.baseURL}/files`, formData, {
        headers: {
          'Xflow-Account': this.accountHeader,
          // Don't set Content-Type - let axios set it automatically with boundary
        },
        timeout: 30000,
      });

      console.log('Upload successful:', response.data);
      console.log('=== END CURL-STYLE UPLOAD ===');
      
      return response.data;
    } catch (error: any) {
      console.error('Curl-style upload failed:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Error response headers:', error.response?.headers);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Bad Request';
        throw new Error(`File upload failed (400): ${errorMessage}`);
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized: Invalid account credentials');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error: Please try again later');
      } else {
        throw new Error(error.message || 'Failed to upload file');
      }
    }
  }

  /**
   * Test upload exactly like the curl command
   * @param file - File to upload
   * @returns Promise with test result
   */
  async testCurlStyleUpload(file: File): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const result = await this.uploadFileCurlStyle(file);
      return {
        success: true,
        message: 'Curl-style upload successful',
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Curl-style upload failed',
        data: null
      };
    }
  }

  /**
   * Test the exact curl command format with purpose parameter
   * @param file - File to upload
   * @returns Promise with test result
   */
  async testExactCurlFormat(file: File): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('=== TESTING EXACT CURL FORMAT ===');
      console.log('Testing exact curl command format:');
      console.log(this.getCurlCommand(file.name));
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'finance_document');
      
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `${value.name} (${value.size} bytes, ${value.type})` : value);
      }
      
      const response = await axios.post(`${this.baseURL}/files`, formData, {
        headers: {
          'Xflow-Account': this.accountHeader,
        },
        timeout: 30000,
      });

      console.log('Exact curl format test successful:', response.data);
      console.log('=== END EXACT CURL FORMAT TEST ===');
      
      return {
        success: true,
        message: 'Exact curl format test successful',
        data: response.data
      };
    } catch (error: any) {
      console.error('Exact curl format test failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Exact curl format test failed',
        data: error.response?.data
      };
    }
  }

  /**
   * Detailed diagnostic for file upload issues
   * @param file - File to test
   * @returns Promise with detailed diagnostic information
   */
  async diagnoseUploadIssue(file: File): Promise<{ success: boolean; message: string; details: any }> {
    const details: any = {
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      },
      apiInfo: {
        baseURL: this.baseURL,
        accountHeader: this.accountHeader,
        endpoint: `${this.baseURL}/files`
      },
      tests: {}
    };

    try {
      // Test 1: File validation
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      details.tests.fileValidation = {
        hasValidType: allowedTypes.includes(file.type),
        fileType: file.type,
        allowedTypes: allowedTypes,
        fileExtension: fileExtension,
        sizeValid: file.size <= 10 * 1024 * 1024,
        fileSize: file.size
      };

      // Test 2: API connection
      const connectionTest = await this.testConnection();
      details.tests.apiConnection = connectionTest;

      // Test 3: FormData creation (clean - file only)
      const formData = new FormData();
      formData.append('file', file);
      
      details.tests.formData = {
        hasFile: formData.has('file'),
        hasPurpose: formData.has('purpose'),
        formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
          key,
          value: value instanceof File ? {
            name: value.name,
            size: value.size,
            type: value.type
          } : value
        }))
      };

      // Test 4: Try clean upload (file only)
      try {
        const cleanFormData = new FormData();
        cleanFormData.append('file', file);
        
        const cleanResponse = await axios.post(`${this.baseURL}/files`, cleanFormData, {
          headers: {
            'Xflow-Account': this.accountHeader,
          },
          timeout: 30000,
        });
        
        details.tests.cleanUpload = {
          success: true,
          status: cleanResponse.status,
          data: cleanResponse.data
        };
      } catch (cleanError: any) {
        details.tests.cleanUpload = {
          success: false,
          status: cleanError.response?.status,
          error: cleanError.response?.data || cleanError.message,
          headers: cleanError.response?.headers
        };
      }

      // Test 5: Try upload with purpose parameter (for comparison)
      try {
        const purposeFormData = new FormData();
        purposeFormData.append('file', file);
        purposeFormData.append('purpose', 'finance_document');
        
        const purposeResponse = await axios.post(`${this.baseURL}/files`, purposeFormData, {
          headers: {
            'Xflow-Account': this.accountHeader,
          },
          timeout: 30000,
        });
        
        details.tests.purposeUpload = {
          success: true,
          status: purposeResponse.status,
          data: purposeResponse.data
        };
      } catch (purposeError: any) {
        details.tests.purposeUpload = {
          success: false,
          status: purposeError.response?.status,
          error: purposeError.response?.data || purposeError.message,
          headers: purposeError.response?.headers
        };
      }

      // Determine overall success based on clean upload
      const cleanUploadSuccess = details.tests.cleanUpload?.success || false;
      const purposeUploadSuccess = details.tests.purposeUpload?.success || false;
      
      let message = 'Diagnostic completed. ';
      if (cleanUploadSuccess) {
        message += 'Clean upload (file only) succeeded.';
      } else if (purposeUploadSuccess) {
        message += 'Upload with purpose parameter succeeded.';
      } else {
        message += 'Both upload methods failed. Check details for specific issues.';
      }

      return {
        success: cleanUploadSuccess || purposeUploadSuccess,
        message: message,
        details: details
      };

    } catch (error: any) {
      details.error = error.message;
      return {
        success: false,
        message: `Diagnostic failed: ${error.message}`,
        details: details
      };
    }
  }
}

export default new FileUploadService();
