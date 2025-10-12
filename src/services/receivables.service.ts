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

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
  }

  async createReceivable(receivableData: ReceivablesData): Promise<ReceivablesResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/receivables`, receivableData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return {
        success: true,
        message: 'Receivable created successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error creating receivable:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to create receivable. Please try again.');
      }
    }
  }

  async getReceivables(): Promise<any> {
    try {
      const response = await axios.get('http://43.205.26.213:7015/receivables', {
        headers: {
          'Xflow-Account': 'account_F0A_1759166669125_GuHWS_000',
          'Content-Type': 'application/json',
        },
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
      const response = await axios.get(`${this.baseURL}/receivables/${receivableId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching receivable:', error);
      throw new Error('Failed to fetch receivable details');
    }
  }

  async updateReceivable(receivableId: string, receivableData: Partial<ReceivablesData>): Promise<ReceivablesResponse> {
    try {
      const response = await axios.put(`${this.baseURL}/receivables/${receivableId}`, receivableData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
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
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
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
}

export default new ReceivablesService();
