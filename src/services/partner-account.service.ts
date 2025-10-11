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
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
  }

  async createPartnerAccount(accountData: PartnerAccountData): Promise<PartnerAccountResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/partner-accounts`, accountData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return {
        success: true,
        message: 'Partner account created successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error creating partner account:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to create partner account. Please try again.');
      }
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
