import { useState, useEffect } from 'react';
import { useTelegram } from './useTelegram';
import { useToast } from './useToast';
import AuthService from '../services/authService';
import { AuthUser } from '../types/auth';

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const { tg, telegramReady, telegramInitData } = useTelegram();
  const { showToast } = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authService = AuthService.getInstance();

  // TEMPORARY: Skip auth for development
  useEffect(() => {
    const mockUser: AuthUser = {
      id: 123456789,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      language_code: 'en',
      is_premium: false
    };
    
    // Set mock user and bypass authentication
    setUser(mockUser);
    setIsAuthenticated(true);
    setIsLoading(false);
    setError(null);
    
    // Save mock user to localStorage
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    
    return;
  }, []);

  // Check for existing tokens and user data on mount
  useEffect(() => {
    // TEMPORARY: Disabled for development
    return;
    
    const checkExistingAuth = () => {
      try {
        // Check if we have valid tokens
        if (authService.hasValidTokens()) {
          // Try to get user data from localStorage
          const savedUser = localStorage.getItem('auth_user');
          if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setIsAuthenticated(true);
            setIsLoading(false);
            setError(null);
            return;
          }
        }
      } catch (err) {
        console.log('No existing auth found, will authenticate with Telegram');
      }
    };

    checkExistingAuth();
  }, []);

  // React to Telegram readiness and authenticate when ready
  useEffect(() => {
    // TEMPORARY: Disabled for development
    return;
    
    if (telegramReady && telegramInitData && !isAuthenticated && isLoading) {
      authenticateUser();
    }
  }, [telegramReady, telegramInitData, isAuthenticated, isLoading]);

  // Show error if Telegram is not ready after reasonable time
  useEffect(() => {
    // TEMPORARY: Disabled for development
    return;
    
    if (isLoading && !telegramReady) {
      const timeout = setTimeout(() => {
        if (!telegramReady && !isAuthenticated) {
          setError('Telegram data not available - please open in Telegram');
          setIsLoading(false);
        }
      }, 5000); // Wait 5 seconds for Telegram to be ready

      return () => clearTimeout(timeout);
    }
  }, [isLoading, telegramReady, isAuthenticated]);
  const authenticateUser = async () => {
    setError(null);

    // Ensure we have Telegram data
    if (!telegramInitData || !tg?.initDataUnsafe) {
      setError('Telegram data not available - please open in Telegram');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await authService.authenticateWithTelegram(telegramInitData);
      
      if (result.success && 'user' in result) {
        setUser(result.user);
        setIsAuthenticated(true);
        setError(null);
        setIsLoading(false);
        
        // Save user data to localStorage
        localStorage.setItem('auth_user', JSON.stringify(result.user));
      } else {
        // Retry authentication silently up to 3 times
        await retryAuthentication();
      }
    } catch (err) {
      // Retry authentication silently up to 3 times
      await retryAuthentication();
    }
  };

  const retryAuthentication = async (attempt = 1) => {
    if (attempt > 3) {
      const errorMsg = 'Unable to connect to authentication server. Please check your internet connection and try again.';
      setError(errorMsg);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      
      showToast({
        type: 'error',
        title: 'Authentication Failed',
        message: errorMsg,
        duration: 8000
      });
      return;
    }

    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));

    try {
      const result = await authService.authenticateWithTelegram(telegramInitData!);
      
      if (result.success && 'user' in result) {
        setUser(result.user);
        setIsAuthenticated(true);
        setError(null);
        setIsLoading(false);
        localStorage.setItem('auth_user', JSON.stringify(result.user));
      } else {
        await retryAuthentication(attempt + 1);
      }
    } catch (err) {
      await retryAuthentication(attempt + 1);
    }
  };

  const login = async () => {
    setIsLoading(true);
    setError(null);
    await authenticateUser();
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('auth_user');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
};