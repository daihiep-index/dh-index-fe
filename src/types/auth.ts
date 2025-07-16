export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  is_superuser: boolean;
  settings: Record<string, any>;
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