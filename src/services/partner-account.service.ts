import axios from 'axios';

export interface PartnerAccountData {
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

// New API format for the /partners endpoint
export interface NewPartnerData {
  email: string;
  legal_name: string;
  name: string;
  nickname: string;
  business_type: string;
  city: string;
  country: string;
  address_line1: string;
  postal_code: string;
  state: string;
  account_id: string;
}

export interface PartnerAccountResponse {
  success: boolean;
  message: string;
  data?: {
    account_id: string;
    status: string;
  };
}

class PartnerAccountService {
  private baseURL: string;

  constructor() {
    // Use the specified IP address for the API
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 
                   process.env.REACT_APP_API_BASE_URL || 
                   'http://43.205.26.213:7015';
    
    console.log('PartnerAccountService initialized with baseURL:', this.baseURL);
  }

  // Transform old format to new API format
  private transformToNewFormat(accountData: PartnerAccountData, accountId: string = 'account_F0A_1759166669125_GuHWS_000'): NewPartnerData {
    return {
      email: accountData.business_details.email,
      legal_name: accountData.business_details.legal_name,
      name: accountData.business_details.legal_name, // Using legal_name as name
      nickname: accountData.nickname,
      business_type: accountData.business_details.type,
      city: accountData.business_details.physical_address.city,
      country: accountData.business_details.physical_address.country,
      address_line1: accountData.business_details.physical_address.line1,
      postal_code: accountData.business_details.physical_address.postal_code,
      state: accountData.business_details.physical_address.state,
      account_id: accountId
    };
  }

  // Get Xflow-Account header from localStorage or use default
  private getXflowAccountHeader(): string {
    return localStorage.getItem('xflow-account') || 'account_F0A_1759166669125_GuHWS_000';
  }

  // New method for creating partners using the /partners endpoint
  async createPartner(partnerData: NewPartnerData): Promise<PartnerAccountResponse> {
    try {
      console.log('Creating partner with data:', partnerData);
      console.log('Making request to:', `${this.baseURL}/partners`);
      console.log('Using Xflow-Account header:', this.getXflowAccountHeader());
      
      const response = await axios.post(`${this.baseURL}/partners`, partnerData, {
        headers: {
          'Content-Type': 'application/json',
          'Xflow-Account': this.getXflowAccountHeader(),
        },
        timeout: 30000, // 30 second timeout
      });

      console.log('Partner creation successful:', response.data);

      return {
        success: true,
        message: 'Partner created successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error creating partner:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: `${this.baseURL}/partners`
      });
      
      // Provide more specific error messages
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Cannot connect to server at ${this.baseURL}. Please check if the server is running.`);
      } else if (error.code === 'ENOTFOUND') {
        throw new Error(`Server not found at ${this.baseURL}. Please check the URL.`);
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. The server is taking too long to respond.');
      } else if (error.response?.status === 404) {
        throw new Error('Partners endpoint not found. Please check if the server supports the /partners endpoint.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to create partner. Please try again.');
      }
    }
  }

  // Updated method that uses the new API
  async createPartnerAccount(accountData: PartnerAccountData & { account_id?: string }): Promise<PartnerAccountResponse> {
    try {
      // Transform the data to the new format, using account_id from form data if provided
      const accountId = accountData.account_id || 'account_F0A_1759166669125_GuHWS_000';
      const newFormatData = this.transformToNewFormat(accountData, accountId);
      
      // Use the new createPartner method
      return await this.createPartner(newFormatData);
    } catch (error: any) {
      console.error('Error creating partner account:', error);
      throw error;
    }
  }

  async getPartnerAccounts(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseURL}/partner-accounts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching partner accounts:', error);
      throw new Error('Failed to fetch partner accounts');
    }
  }

  // New method to get a specific partner using the /partners endpoint
  async getPartnerById(partnerId: string): Promise<any> {
    try {
      console.log('Fetching partner with ID:', partnerId);
      console.log('Making request to:', `${this.baseURL}/partners/${partnerId}`);
      console.log('Using Xflow-Account header:', this.getXflowAccountHeader());
      
      const response = await axios.get(`${this.baseURL}/partners/${partnerId}`, {
        headers: {
          'Xflow-Account': this.getXflowAccountHeader(),
        },
        timeout: 30000,
      });

      console.log('Partner fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching partner:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: `${this.baseURL}/partners/${partnerId}`
      });
      
      // Provide more specific error messages
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Cannot connect to server at ${this.baseURL}. Please check if the server is running.`);
      } else if (error.code === 'ENOTFOUND') {
        throw new Error(`Server not found at ${this.baseURL}. Please check the URL.`);
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. The server is taking too long to respond.');
      } else if (error.response?.status === 404) {
        throw new Error(`Partner with ID ${partnerId} not found.`);
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch partner details. Please try again.');
      }
    }
  }

  // Method to get all partners (if the API supports it)
  async getAllPartners(): Promise<any[]> {
    try {
      console.log('Fetching all partners');
      console.log('Making request to:', `${this.baseURL}/partners`);
      console.log('Using Xflow-Account header:', this.getXflowAccountHeader());
      
      const response = await axios.get(`${this.baseURL}/partners`, {
        headers: {
          'Xflow-Account': this.getXflowAccountHeader(),
        },
        timeout: 30000,
      });

      console.log('Partners fetched successfully:', response.data);
      // The API returns {object: "list", data: [...]} format
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Error fetching partners:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: `${this.baseURL}/partners`
      });
      
      // Provide more specific error messages
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Cannot connect to server at ${this.baseURL}. Please check if the server is running.`);
      } else if (error.code === 'ENOTFOUND') {
        throw new Error(`Server not found at ${this.baseURL}. Please check the URL.`);
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. The server is taking too long to respond.');
      } else if (error.response?.status === 404) {
        throw new Error('Partners endpoint not found. Please check if the server supports the /partners endpoint.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch partners. Please try again.');
      }
    }
  }

  async getPartnerAccountById(accountId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/partner-accounts/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching partner account:', error);
      throw new Error('Failed to fetch partner account details');
    }
  }
}

export default new PartnerAccountService();
