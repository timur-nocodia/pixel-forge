import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTelegram } from '../hooks/useTelegram';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import AuthGuard from './AuthGuard';
import Header from './ui/Header';
import NavBar from './NavBar';
import ToastContainer from './ui/ToastContainer';
import HomePage from '../pages/HomePage';
import HistoryPage from '../pages/HistoryPage';
import SettingsPage from '../pages/SettingsPage';

const TelegramApp: React.FC = () => {
  const { user } = useAuth();
  const { activeTab, setUser } = useAppContext();
  const { debugInfo, isReady, telegramInitData } = useTelegram();
  const { toasts } = useToast();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div key="home" className="animate-fade-in-up">
            <HomePage />
          </div>
        );
      
      case 'history':
        return (
          <div key="history" className="animate-slide-in-left">
            <HistoryPage />
          </div>
        );
      
      case 'settings':
        return (
          <div key="settings" className="animate-slide-in-right">
            <SettingsPage />
          </div>
        );
      
      default:
        return null;
    }
  };

  // Initialize user from Telegram
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  // Debug: Show Telegram data info in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && debugInfo) {
      console.log('🎯 TelegramApp Debug Info:', debugInfo);
      console.log('🎯 Current telegramInitData:', telegramInitData);
    }
  }, [debugInfo, telegramInitData]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-dark-950 text-white">
        <Header />

        {/* Content */}
        <div className="px-4 space-y-6 pb-32">
          {renderContent()}
        </div>

        {/* Navigation Bar */}
        <NavBar />

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} />

        {/* Debug Info in Development */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <div className="fixed top-0 left-0 right-0 bg-dark-900/95 backdrop-blur-sm text-xs text-white p-2 z-50 max-h-32 overflow-y-auto border-b border-dark-800">
            <div>🔍 Debug: Platform: {debugInfo.platform}, Version: {debugInfo.version}</div>
            <div>📊 InitData Length: {debugInfo.rawInitData?.length || 0}</div>
            <div>🔐 Has Signature: {debugInfo.rawInitData?.includes('signature') ? 'YES' : 'NO'}</div>
            <div>👤 User ID: {debugInfo.rawInitDataUnsafe?.user?.id}</div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default TelegramApp;