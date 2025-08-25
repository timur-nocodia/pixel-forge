import AuthService from './authService';

import { GeneratedImage } from '../types';

const API_BASE_URL = 'https://n8n.nocodia.dev/webhook/image-gen-demo-app';
const API_VERSION = '1.0.7'; // Update this with each deployment

class ApiService {
  private static instance: ApiService;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
    console.log(`🎯 ApiService initialized - Version: ${API_VERSION}`);
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // TEMPORARY: Skip authentication for development
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    return fetch(url, {
      ...options,
      headers,
      mode: 'cors',
    });
    
    try {
      return await this.authService.makeAuthenticatedRequest(url, options);
    } catch (error) {
      throw error;
    }
  }

  public async generateImage(prompt: string, style: string): Promise<{ success: boolean; image_urls?: GeneratedImage[]; error?: string; error_code?: string; message?: string }> {
    try {
      console.log(`🎨 Generating image with prompt: "${prompt}" and style: "${style}"`);
      
      const response = await this.makeRequest('/generate-image', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          style,
        }),
      });

      const data = await response.json();
      
      console.log(`📡 Generation response status: ${response.status}`);
      console.log(`📋 Generation response data:`, data);

      if (!response.ok) {
        console.error(`❌ Generation failed:`, data);
        return {
          success: false,
          error: data.error || 'GENERATION_FAILED',
          message: data.message || 'Server error occurred while generating images. Please try again later.'
        };
      }
      
      console.log(`✅ Images generated successfully`);
      return data;
    } catch (error) {
      console.error(`💥 Generation error:`, error);
      
      let errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Authentication')) {
          errorMessage = 'Session expired. Please refresh the app and try again.';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network connection failed. Please check your internet and try again.';
        }
      }
        
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: errorMessage
      };
    }
  }

  public async downloadImageToTelegram(imageId: number): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      console.log(`🔽 Downloading image ${imageId} to Telegram...`);
      
      const response = await this.makeRequest(`/download-image?image_id=${imageId}`, {
        method: 'GET',
      });

      console.log(`📡 Download response status: ${response.status}`);
      const data = await response.json();
      console.log(`📋 Download response data:`, data);

      if (!response.ok) {
        console.error(`❌ Download failed:`, data);
        return {
          success: false,
          error: data.error || 'DOWNLOAD_FAILED',
          message: data.message || 'Server error occurred while sending image. Please try again later.'
        };
      }
      
      console.log(`✅ Image ${imageId} downloaded successfully`);
      return data;
    } catch (error) {
      console.error(`💥 Download error for image ${imageId}:`, error);
      
      let errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Authentication')) {
          errorMessage = 'Session expired. Please refresh the app and try again.';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network connection failed. Please check your internet and try again.';
        }
      }
        
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: errorMessage
      };
    }
  }

  public async getGenerationHistory(): Promise<any> {
    const response = await this.makeRequest('/history', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }

    return response.json();
  }

  public async getUserProfile(): Promise<any> {
    const response = await this.makeRequest('/profile', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }
}

export default ApiService;