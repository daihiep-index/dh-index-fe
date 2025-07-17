export interface UserSettings {
  theme?: 'light' | 'dark';
  notifications?: {
    email?: boolean;
    push?: boolean;
    trading_alerts?: boolean;
  };
  trading?: {
    default_order_type?: 'market' | 'limit' | 'stop';
    confirmation_required?: boolean;
    risk_level?: 'conservative' | 'moderate' | 'aggressive';
  };
  display?: {
    currency?: string;
    timezone?: string;
    chart_type?: 'candlestick' | 'line' | 'bar';
  };
  // Allow for additional settings that might be added in the future
  [key: string]: unknown;
}

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  is_superuser: boolean;
  settings: UserSettings;
  is_active: boolean;
}

export interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}