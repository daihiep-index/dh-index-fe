import { UserHolding } from '../types/stock';
import { AuthService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface CreateHoldingRequest {
  stock_code: string;
  quantity: number;
  value: number; // Giá tính theo nghìn VNĐ
}

export interface UpdateHoldingRequest {
  quantity?: number;
  value?: number; // Giá tính theo nghìn VNĐ
}

export class StockService {
  private static instance: StockService;
  private authService: AuthService;
  
  constructor() {
    this.authService = AuthService.getInstance();
  }
  
  static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.authService.getAccessToken();
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getUserHoldings(): Promise<UserHolding[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_holdings/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch user holdings');
      }

      const data: UserHolding[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user holdings:', error);
      throw error;
    }
  }

  async createHolding(holdingData: CreateHoldingRequest): Promise<UserHolding> {
    try {
      const formData = new FormData();
      formData.append('stock_code', holdingData.stock_code);
      formData.append('quantity', holdingData.quantity.toString());
      formData.append('value', holdingData.value.toString());

      const response = await fetch(`${API_BASE_URL}/user_holdings/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.authService.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create holding');
      }

      const data: UserHolding = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating holding:', error);
      throw error;
    }
  }

  async updateHolding(id: string, updateData: UpdateHoldingRequest): Promise<UserHolding> {
    try {
      const formData = new FormData();
      if (updateData.quantity !== undefined) {
        formData.append('quantity', updateData.quantity.toString());
      }
      if (updateData.value !== undefined) {
        formData.append('value', updateData.value.toString());
      }

      const response = await fetch(`${API_BASE_URL}/user_holdings/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.authService.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update holding');
      }

      const data: UserHolding = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating holding:', error);
      throw error;
    }
  }

  async deleteHolding(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/user_holdings/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.authService.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete holding');
      }
    } catch (error) {
      console.error('Error deleting holding:', error);
      throw error;
    }
  }
}
