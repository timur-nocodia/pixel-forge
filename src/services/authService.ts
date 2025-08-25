import { AuthResponse, RefreshResponse, AuthError, AuthTokens } from '../types/auth';

const API_BASE_URL = 'https://n8n.nocodia.dev/webhook/image-gen-demo-app';
const APP_VERSION = '1.0.7'; // Update this with each deployment
const BUILD_TIMESTAMP = new Date().toISOString();

class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshPromise: Promise<RefreshResponse | AuthError> | null = null;

  private constructor() {
    this.loadTokensFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadTokensFromStorage(): void {
    try {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
      const expiry = localStorage.getItem('token_expiry');
      this.tokenExpiry = expiry ? parseInt(expiry, 10) : null;
    } catch (error) {
      // Silent error handling
    }
  }

  private saveTokensFromResponse(response: AuthResponse | RefreshResponse): void {
    try {
      this.accessToken = response.access_token;
      this.tokenExpiry = Date.now() + (response.expires_in * 1000);

      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('token_expiry', this.tokenExpiry.toString());

      // Only update refresh token if provided
      if (response.refresh_token) {
        this.refreshToken = response.refresh_token;
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    } catch (error) {
      console.error('Error saving tokens to storage:', error);
    }
  }

  private clearTokensFromStorage(): void {
    try {
      this.accessToken = null;
      this.refreshToken = null;
      this.tokenExpiry = null;

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expiry');
    } catch (error) {
      console.error('Error clearing tokens from storage:', error);
    }
  }

  public isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    // Add 30 seconds buffer to refresh before actual expiry
    return Date.now() >= (this.tokenExpiry - 30000);
  }

  public hasValidTokens(): boolean {
    return !!(this.accessToken && this.refreshToken && !this.isTokenExpired());
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public async authenticateWithTelegram(initData: string): Promise<AuthResponse | AuthError> {
    try {
      // Debug: Log the exact data being sent to server
      console.log('🚀 Sending to server - initData:', initData);
      console.log('🚀 initData length:', initData.length);
      console.log('🚀 initData contains signature:', initData.includes('signature'));
      
      const response = await fetch(`${API_BASE_URL}/auth/telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initData: initData
        })
      });

      const data = await response.json();
      
      // Debug: Log server response
      console.log('📥 Server response status:', response.status);
      console.log('📥 Server response data:', data);

      if (!response.ok) {
        return {
          success: false,
          error: 'AUTH_FAILED',
          message: data.message || `Authentication failed (Status: ${response.status})`
        };
      }

      if (data.success && data.access_token && data.refresh_token) {
        this.saveTokensFromResponse(data);
        return data as AuthResponse;
      }

      return {
        success: false,
        error: 'INVALID_RESPONSE',
        message: data.message || 'Invalid response from server'
      };
    } catch (error) {
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Network error during authentication'
      };
    }
  }

  private async refreshAccessToken(): Promise<RefreshResponse | AuthError> {
    // If there's already a refresh in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken) {
      return {
        success: false,
        error: 'NO_REFRESH_TOKEN',
        message: 'No refresh token available'
      };
    }


    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh_token: this.refreshToken
          })
        });
        

        const data = await response.json();

        if (!response.ok) {
          this.clearTokensFromStorage();
          return {
            success: false,
            error: 'REFRESH_FAILED',
            message: data.message || `Token refresh failed (v${APP_VERSION})`
          };
        }

        if (data.success && data.access_token) {
          this.saveTokensFromResponse(data);
          return data as RefreshResponse;
        }

        return {
          success: false,
          error: 'INVALID_RESPONSE',
          message: data.message || `Invalid response from server (v${APP_VERSION})`
        };
      } catch (error) {
        return {
          success: false,
          error: 'NETWORK_ERROR',
          message: `Network error during token refresh (v${APP_VERSION})`
        };
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  public async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    // Ensure we have a valid token before making the request
    await this.ensureValidToken();

    if (!this.accessToken) {
      throw new Error('No access token available after refresh attempt');
    }

    // Make the request with current token
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
    });

    // If we get 401, try to refresh and retry once
    if (response.status === 401) {
      const refreshResult = await this.refreshAccessToken();
      if (refreshResult.success) {
        // Retry with new token
        const retryHeaders = {
          ...options.headers,
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        };

        return fetch(url, {
          ...options,
          headers: retryHeaders,
          mode: 'cors',
        });
      } else {
        throw new Error(`Please try again (v${APP_VERSION})`);
      }
    }

    return response;
  }

  private async ensureValidToken(): Promise<void> {
    if (this.isTokenExpired() && this.refreshToken) {
      const refreshResult = await this.refreshAccessToken();
      if (!refreshResult.success) {
        throw new Error(`Please try again (v${APP_VERSION})`);
      }
    }
  }

  public logout(): void {
    this.clearTokensFromStorage();
  }
}

export default AuthService;