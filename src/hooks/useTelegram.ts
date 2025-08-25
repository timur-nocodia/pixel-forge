import { useEffect, useState } from 'react';

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
  };
  showAlert: (message: string) => void;
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    chat_type?: string;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegram = () => {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [telegramReady, setTelegramReady] = useState(false);
  const [telegramInitData, setTelegramInitData] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      // Initialize the web app
      webApp.ready();
      webApp.expand();
      
      // Debug: Log raw Telegram data
      console.log('🔍 RAW Telegram initData:', webApp.initData);
      console.log('🔍 RAW Telegram initDataUnsafe:', webApp.initDataUnsafe);
      console.log('🔍 RAW Telegram version:', webApp.version);
      console.log('🔍 RAW Telegram platform:', webApp.platform);
      
      // Wait longer for initialization to complete and data to be populated
      setTimeout(() => {
        // Log final data that will be used
        console.log('✅ Final initData to be used:', webApp.initData);
        console.log('✅ Final user data:', webApp.initDataUnsafe?.user);
        
        setTg(webApp);
        setUser(webApp.initDataUnsafe?.user);
        setTelegramInitData(webApp.initData || null);
        setDebugInfo({
          rawInitData: webApp.initData,
          rawInitDataUnsafe: webApp.initDataUnsafe,
          version: webApp.version,
          platform: webApp.platform
        });
        setTelegramReady(true);
        setIsReady(true);
      }, 1000);
    } else {
      // For development/testing purposes
      if (process.env.NODE_ENV === 'development') {
        const mockWebApp = {
          ready: () => {},
          expand: () => {},
          initData: 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1640995200&hash=mock_hash_for_development',
          initDataUnsafe: {
            user: {
              id: 123456789,
              first_name: 'Test',
              last_name: 'User',
              username: 'testuser',
              language_code: 'en'
            },
            auth_date: Math.floor(Date.now() / 1000),
            hash: 'mock_hash'
          },
          platform: 'web',
          version: '6.0',
          colorScheme: 'dark' as const,
          HapticFeedback: {
            impactOccurred: () => {},
            notificationOccurred: () => {},
            selectionChanged: () => {}
          }
        } as any;
        
        setTg(mockWebApp);
        setUser(mockWebApp.initDataUnsafe.user);
        setTelegramInitData(mockWebApp.initData);
        setDebugInfo({
          rawInitData: mockWebApp.initData,
          rawInitDataUnsafe: mockWebApp.initDataUnsafe,
          version: mockWebApp.version,
          platform: mockWebApp.platform,
          isDevelopment: true
        });
        setTelegramReady(true);
        setIsReady(true);
      }
    }
  }, []);

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(type);
    }
  };

  const notificationFeedback = (type: 'error' | 'success' | 'warning') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred(type);
    }
  };

  return {
    tg,
    user,
    isReady,
    telegramReady,
    telegramInitData,
    debugInfo,
    hapticFeedback,
    notificationFeedback,
  };
};