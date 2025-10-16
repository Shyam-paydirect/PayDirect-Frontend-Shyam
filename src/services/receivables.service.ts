import axios from 'axios';

export interface ReceivablesData {
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

// New API format for the /receivables endpoint
export interface NewReceivablesData {
  account_id: string | null;
  currency: string;
  amount_maximum_reconcilable: string | number;
  purpose_code: string;
  transaction_type: string;
  description: string;
  invoice: {
    amount: string;
    creation_date: string;
    currency: string;
    document: string | null;
    due_date: string;
    reference_number: string;
  };
  metadata?: {
    customer_reference?: string;
    order_id?: string;
    partner_id?: string;
    document_id?: string;
  };
}

export interface ReceivablesResponse {
  success: boolean;
  message: string;
  data?: {
    receivable_id: string;
    status: string;
    created_at: string;
  };
}

export interface ReceivableApiItem {
  id?: string;
  created_at?: string;
  created?: string;
  reference_number?: string;
  partner_name?: string;
  partnerName?: string;
  description?: string;
  purpose_code?: string;
  amount_maximum_reconcilable?: string;
  amount?: string;
  amount_pending?: string;
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
  currency?: string;
  invoice?: {
    reference_number?: string;
    amount?: string;
    currency?: string;
  };
}

class ReceivablesService {
  private baseURL: string;
  private xflowBaseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://43.205.26.213:7015';
    this.xflowBaseURL = process.env.NEXT_PUBLIC_XFLOW_API_URL || 'https://api.xflowpay.com/v1';
  }

  // Get Xflow-Account header from localStorage or use default
  private getXflowAccountHeader(): string {
    // Prefer browser storage, then env, then a safe default
    try {
      if (typeof window !== 'undefined') {
        const ls = localStorage.getItem('xflow-account');
        if (ls) return ls;
      }
    } catch (_) {}
    const envAcct = (process as any)?.env?.NEXT_PUBLIC_XFLOW_ACCOUNT;
    return envAcct || 'account_F0A_1759166669125_GuHWS_000';
  }

  // Expose the configured account id for consumers that need to build payloads
  public getAccountId(): string {
    return this.getXflowAccountHeader();
  }

  // Build auth headers including Xflow-Account and Authorization (Bearer <secret>) if available
  private getAuthHeaders(extra: Record<string, string> = {}): Record<string, string> {
    let secretKey: string | null = null;
    try {
      if (typeof window !== 'undefined') {
        secretKey = localStorage.getItem('secret_key') || localStorage.getItem('api_secret');
      }
    } catch (_) {}
    const envKey = (process as any)?.env?.NEXT_PUBLIC_API_KEY;
    const effectiveKey = secretKey || envKey || null;
    const headers: Record<string, string> = {
      'Xflow-Account': this.getXflowAccountHeader(),
      ...extra,
    };
    if (effectiveKey) {
      headers['Authorization'] = `Bearer ${effectiveKey}`;
    }
    return headers;
  }

  // Transform old format to new API format
  private transformToNewFormat(receivableData: ReceivablesData): any {
    // Format dates to YYYY-MM-DD format
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date format:', dateString);
          return '';
        }
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.warn('Error formatting date:', dateString, error);
        return '';
      }
    };

    // Validate required fields
    if (!receivableData.amount_maximum_reconcilable) {
      throw new Error('Amount is required');
    }
    if (!receivableData.currency) {
      throw new Error('Currency is required');
    }
    if (!receivableData.purpose_code) {
      throw new Error('Purpose code is required');
    }
    if (!receivableData.transaction_type) {
      throw new Error('Transaction type is required');
    }
    if (!receivableData.invoice.reference_number) {
      throw new Error('Invoice reference number is required');
    }

    // Map purpose codes to valid API values
    const mapPurposeCode = (purposeCode: string) => {
      const purposeCodeMap: { [key: string]: string } = {
        'P1014': 'P0102', // Map common form values to API values
        'P0102': 'P0102', // Already correct
        'P0101': 'P0101',
        'P0103': 'P0103',
        'P0104': 'P0104',
        'P0105': 'P0105',
        'trade_payment': 'P0102', // Map trade_payment to P0102
        'payment': 'P0102' // Map payment to P0102
      };
      return purposeCodeMap[purposeCode] || 'P0102'; // Default to P0102 if not found
    };

    // Map transaction types to valid API values
    const mapTransactionType = (transactionType: string) => {
      const transactionTypeMap: { [key: string]: string } = {
        'payment': 'services', // Map payment to services (API requirement)
        'services': 'services', // Already correct
        'goods': 'services', // Map goods to services
        'trade': 'services' // Map trade to services
      };
      return transactionTypeMap[transactionType] || 'services'; // Default to services
    };

    const transformedData: NewReceivablesData = {
      account_id:receivableData.account_id, // API expects null for account_id
      currency: receivableData.currency,
      amount_maximum_reconcilable: receivableData.amount_maximum_reconcilable,
      purpose_code: mapPurposeCode(receivableData.purpose_code),
      transaction_type: mapTransactionType(receivableData.transaction_type),
      description: `${mapTransactionType(receivableData.transaction_type)} - ${mapPurposeCode(receivableData.purpose_code)}`,
      invoice: {
        amount: receivableData.invoice.amount || receivableData.amount_maximum_reconcilable,
        creation_date: formatDate(receivableData.invoice.creation_date),
        currency: receivableData.invoice.currency || receivableData.currency,
        document: receivableData.invoice.document || null,
        due_date: formatDate(receivableData.invoice.due_date),
        reference_number: receivableData.invoice.reference_number
      },
      // Add metadata if available
      metadata: receivableData.invoice.reference_number ? {
        customer_reference: receivableData.invoice.reference_number,
        order_id: receivableData.invoice.reference_number,
        partner_id: receivableData.account_id || 'acct_partner_9876543210'
      } : undefined
    };

    console.log('Transformed data for API:', transformedData);
    return transformedData;
  }

  // New method for creating receivables using the /receivables endpoint
  async createReceivableNew(receivableData: NewReceivablesData): Promise<ReceivablesResponse> {
    try {
      console.log('=== RECEIVABLES API DEBUG ===');
      console.log('Creating receivable with data:', JSON.stringify(receivableData, null, 2));
      console.log('Making request to:', `${this.baseURL}/receivables`);
      console.log('Using Xflow-Account header:', this.getXflowAccountHeader());
      console.log('Request headers:', this.getAuthHeaders({ 'Content-Type': 'application/json' }));
      
      const response = await axios.post(`${this.baseURL}/receivables`, receivableData, {
        headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
        timeout: 30000,
      });

      console.log('Receivable creation successful:', response.data);

      return {
        success: true,
        message: 'Receivable created successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('=== RECEIVABLES API ERROR ===');
      console.error('Full error object:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: `${this.baseURL}/receivables`,
        requestData: receivableData,
        requestHeaders: this.getAuthHeaders({ 'Content-Type': 'application/json' })
      });
      
      // Log the full response for debugging
      if (error.response) {
        console.error('Full server response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data
        });
      }
      
      // Provide more specific error messages
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Cannot connect to server at ${this.baseURL}. Please check if the server is running.`);
      } else if (error.code === 'ENOTFOUND') {
        throw new Error(`Server not found at ${this.baseURL}. Please check the URL.`);
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. The server is taking too long to respond.');
      } else if (error.response?.status === 400) {
        // Handle 400 Bad Request with detailed error information
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Bad Request';
        const errorDetails = error.response?.data?.details || error.response?.data;
        console.error('400 Error Details:', errorDetails);
        console.error('Request that failed:', JSON.stringify(receivableData, null, 2));
        throw new Error(`Validation Error: ${errorMessage}. Check console for details.`);
      } else if (error.response?.status === 404) {
        throw new Error('Receivables endpoint not found. Please check if the server supports the /receivables endpoint.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to create receivable. Please try again.');
      }
    }
  }

  // Updated method that uses the new API
  async createReceivable(receivableData: ReceivablesData): Promise<ReceivablesResponse> {
    try {
      console.log('=== RECEIVABLES TRANSFORMATION DEBUG ===');
      console.log('Original form data:', JSON.stringify(receivableData, null, 2));
      
      // Transform the data to the new format
      const newFormatData = this.transformToNewFormat(receivableData);
      console.log('Transformed data:', JSON.stringify(newFormatData, null, 2));
      
      // Use the new createReceivableNew method
      return await this.createReceivableNew(newFormatData);
    } catch (error: any) {
      console.error('Error creating receivable:', error);
      throw error;
    }
  }

  // Enhanced method for creating receivables with custom metadata
  async createReceivableWithMetadata(
    receivableData: ReceivablesData, 
    customMetadata?: {
      customer_reference?: string;
      order_id?: string;
      partner_id?: string;
      document_id?: string;
    }
  ): Promise<ReceivablesResponse> {
    try {
      console.log('=== RECEIVABLES WITH METADATA DEBUG ===');
      console.log('Original form data:', JSON.stringify(receivableData, null, 2));
      console.log('Custom metadata:', JSON.stringify(customMetadata, null, 2));
      
      // Transform the data to the new format
      const newFormatData = this.transformToNewFormat(receivableData);
      
      // Add custom metadata if provided
      if (customMetadata) {
        newFormatData.metadata = {
          ...newFormatData.metadata,
          ...customMetadata
        };
      }
      
      console.log('Final transformed data:', JSON.stringify(newFormatData, null, 2));
      
      // Use the new createReceivableNew method
      return await this.createReceivableNew(newFormatData);
    } catch (error: any) {
      console.error('Error creating receivable with metadata:', error);
      throw error;
    }
  }

  async getReceivables(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/receivables`, {
        headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
        timeout: 30000,
      });

      // Log the raw response for debugging
      console.log('Raw API Response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);

      return response.data;
    } catch (error: any) {
      console.error('Error fetching receivables:', error);
      console.error('Error response:', error.response);
      
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        throw new Error('Network error: Unable to connect to the receivables service');
      } else if (error.response?.status === 404) {
        throw new Error('Receivables endpoint not found');
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized: Invalid account credentials');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error: Please try again later');
      } else {
        throw new Error('Failed to fetch receivables');
      }
    }
  }

  async getReceivableById(receivableId: string): Promise<any> {
    try {
      console.log('=== GET RECEIVABLE BY ID DEBUG ===');
      console.log('Fetching receivable with ID:', receivableId);
      console.log('Making request to:', `${this.baseURL}/receivables/${receivableId}`);
      console.log('Using Xflow-Account header:', this.getXflowAccountHeader());
      
      const response = await axios.get(`${this.baseURL}/receivables/${receivableId}`, {
        headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
        timeout: 30000,
      });

      console.log('Receivable fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('=== GET RECEIVABLE BY ID ERROR ===');
      console.error('Error fetching receivable by ID:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: `${this.baseURL}/receivables/${receivableId}`,
        requestHeaders: this.getAuthHeaders({ 'Content-Type': 'application/json' })
      });
      
      // Log the full response for debugging
      if (error.response) {
        console.error('Full server response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data
        });
      }
      
      // Provide more specific error messages
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Cannot connect to server at ${this.baseURL}. Please check if the server is running.`);
      } else if (error.code === 'ENOTFOUND') {
        throw new Error(`Server not found at ${this.baseURL}. Please check the URL.`);
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. The server is taking too long to respond.');
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Bad Request';
        const errorDetails = error.response?.data?.details || error.response?.data;
        console.error('400 Error Details:', errorDetails);
        throw new Error(`Validation Error: ${errorMessage}. Check console for details.`);
      } else if (error.response?.status === 404) {
        throw new Error(`Receivable with ID '${receivableId}' not found.`);
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch receivable. Please try again.');
      }
    }
  }

  async updateReceivable(receivableId: string, receivableData: Partial<ReceivablesData>): Promise<ReceivablesResponse> {
    try {
      const response = await axios.put(`${this.baseURL}/receivables/${receivableId}`, receivableData, {
        headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      });

      return {
        success: true,
        message: 'Receivable updated successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error updating receivable:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to update receivable. Please try again.');
      }
    }
  }

  async deleteReceivable(receivableId: string): Promise<ReceivablesResponse> {
    try {
      const response = await axios.delete(`${this.baseURL}/receivables/${receivableId}`, {
        headers: this.getAuthHeaders(),
      });

      return {
        success: true,
        message: 'Receivable deleted successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error deleting receivable:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to delete receivable. Please try again.');
      }
    }
  }

  // Reconcile a receivable
  async reconcileReceivable(receivableId: string, payload: any): Promise<any> {
    try {
      console.log('🔹 [reconcileReceivable] Called');
      console.log('📦 Receivable ID:', receivableId);
      console.log('📤 Payload:', payload);
  
      const url = `${this.baseURL}/receivables/${receivableId}/reconcile`;
      console.log('🌐 Full URL:', url);
  
      const headers = this.getAuthHeaders({ 'Content-Type': 'application/json' });
      console.log('🪪 Headers:', headers);
  
      console.log('🚀 Sending POST request...');
      const res = await axios.post(url, payload, { headers });
  
      console.log('✅ [reconcileReceivable] Response received:');
      console.log(res.data);
  
      return res.data;
    } catch (error: any) {
      console.error('❌ [reconcileReceivable] Error occurred:');
      if (error.response) {
        console.error('🔸 Status:', error.response.status);
        console.error('🔸 Response Data:', error.response.data);
      } else if (error.request) {
        console.error('📡 No response received from server');
      } else {
        console.error('⚙️ Request setup error:', error.message);
      }
      throw error;
    }
  }

  // Confirm a receivable
  async confirmReceivable(receivableId: string, documentId?: string): Promise<any> {
    const url = `${this.baseURL}/receivables/${receivableId}/confirm`;
    const headers = this.getAuthHeaders({ 'Content-Type': 'application/json' });
    const body = documentId ? { document_id: documentId } : {};
    const res = await axios.post(url, body, { headers });
    return res.data;
  }
  

  // Reconcile via Xflow public API (requires Bearer key and account_id)
  // async reconcileReceivableXflow(receivableId: string, amount: string, accountId?: string): Promise<any> {
  //   const url = `${this.xflowBaseURL}/receivables/${receivableId}/reconcile`;
  //   // Prefer explicit account id, otherwise derive from local storage/env
  //   const acct = accountId || this.getAccountId();
  //   // Secret can come from localStorage or env
  //   let secretKey: string | null = null;
  //   try {
  //     if (typeof window !== 'undefined') {
  //       secretKey = localStorage.getItem('secret_key') || localStorage.getItem('api_secret') || null;
  //     }
  //   } catch (_) {}
  //   const envKey = (process as any)?.env?.NEXT_PUBLIC_API_KEY;
  //   const apiKey = secretKey || envKey;
  //   if (!apiKey) {
  //     throw new Error('Missing API key. Set localStorage.secret_key or NEXT_PUBLIC_API_KEY');
  //   }

  //   const headers: Record<string, string> = {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json',
  //   };

  //   const body = {
  //     account_id: acct,
  //     amount: amount,
  //   };

  //   const res = await axios.post(url, body, { headers });
  //   return res.data;
  // }

  // Fetch deposits list from Xflow API
  async fetchDeposits(): Promise<any[]> {
    // Prefer backend proxy endpoint per requirement
    const url = `${this.baseURL}/deposits`;
    const headers = this.getAuthHeaders({ 'Content-Type': 'application/json' });
    const res = await axios.get(url, { headers, params: { limit: 10, status: 'completed' } });
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }
}

export default new ReceivablesService();
