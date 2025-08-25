export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface AuthUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
}

export interface AuthResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
  message?: string;
}

export interface RefreshResponse {
  success: boolean;
  access_token: string;
  refresh_token?: string; // Optional since server might not return it
  token_type: string;
  expires_in: number;
  message?: string;
}

export interface AuthError {
  success: false;
  error: string;
  message: string;
}