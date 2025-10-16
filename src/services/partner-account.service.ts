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
                   'https://exp.paydirectgo.com';
    
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
      
      // Soft-fail: return structured response instead of throwing (avoid overlay)
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to create partner';
      return { success: false, message: msg, data: error?.response?.data } as any;
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
      const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Failed to create partner account';
      return { success: false, message: msg, data: error?.response?.data } as any;
    }
  }

  async getPartnerAccounts(): Promise<any[]> {
    try {
      // Delegate to unified partners endpoint (server doesn't expose /partner-accounts)
      return await this.getAllPartners();
    } catch (error: any) {
      console.error('Error fetching partner accounts:', error);
      return [];
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
      // Soft-fail
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        `Failed to fetch partner ${partnerId}`;
      return { success: false, message: msg, data: error?.response?.data } as any;
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
        params: {
          account_id: this.getXflowAccountHeader(),
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
      
      // Soft-fail: avoid overlay, return empty list
      return [];
    }
  }

  async getPartnerAccountById(accountId: string): Promise<any> {
    try {
      // Delegate to unified partner endpoint
      return await this.getPartnerById(accountId);
    } catch (error: any) {
      console.error('Error fetching partner account:', error);
      return { success: false, message: 'Failed to fetch partner account details' } as any;
    }
  }
}

export default new PartnerAccountService();
