import React from 'react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTelegram } from '../hooks/useTelegram';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { hapticFeedback } = useTelegram();
  const [notifications, setNotifications] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  const handleUpgrade = () => {
    hapticFeedback('medium');
    // Upgrade logic here
  };

  const handleNotifications = () => {
    hapticFeedback('light');
    setNotifications(!notifications);
  };

  const handleHapticFeedback = () => {
    hapticFeedback('light');
    setHapticEnabled(!hapticEnabled);
  };

  const handlePrivacyPolicy = () => {
    hapticFeedback('light');
    // Open privacy policy
  };

  const handleTermsOfService = () => {
    hapticFeedback('light');
    // Open terms of service
  };

  const handleLogout = () => {
    hapticFeedback('medium');
    logout();
  };

  return (
    <div className="pb-8 space-y-6">
      {/* Compact Profile Section */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-5 backdrop-blur-sm opacity-0 animate-fade-in-scale">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center text-dark-950 font-bold text-lg overflow-hidden shadow-lg">
            {user?.photo_url ? (
              <img 
                src={user.photo_url} 
                alt={user.first_name} 
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              user?.first_name?.[0] || 'U'
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">
              {user?.first_name} {user?.last_name || ''}
              {user?.is_premium && (
                <span className="ml-2 text-accent-400 text-sm">⭐</span>
              )}
            </h2>
            <p className="text-white/70 text-sm">@{user?.username || 'username'}</p>
          </div>
          <div className="text-right">
            <span className={`px-2 py-1 rounded-full text-xs ${
              user?.is_premium 
                ? 'bg-accent-500 text-dark-950 font-medium' 
                : 'bg-dark-700 text-white/80 font-medium'
            }`}>
              {user?.is_premium ? 'Premium' : 'Free'}
            </span>
            <p className="text-white/70 text-xs mt-1">7/10 left</p>
          </div>
        </div>
        
        <button 
          onClick={handleUpgrade}
          className="w-full bg-gradient-to-r from-accent-400 to-accent-500 py-3 rounded-2xl font-bold text-dark-950 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:from-accent-300 hover:to-accent-400 mt-4"
        >
          Upgrade to Pro - $9.99/month
        </button>
      </div>

      {/* Compact Settings */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-3xl backdrop-blur-sm overflow-hidden opacity-0 animate-fade-in-scale animate-delay-100">
        <div className="divide-y divide-dark-800">
          <button 
            onClick={handleNotifications}
            className="w-full flex items-center justify-between p-4 hover:bg-dark-800/30 transition-all duration-200 active:scale-[0.99]"
          >
            <span className="text-white font-medium">Notifications</span>
            <div className={`w-11 h-6 rounded-full relative transition-colors ${
              notifications ? 'bg-purple-600' : 'bg-gray-600'
            }`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                notifications ? 'right-0.5' : 'left-0.5'
              }`}></div>
            </div>
          </button>
          
          <button 
            onClick={handleHapticFeedback}
            className="w-full flex items-center justify-between p-4 hover:bg-dark-800/30 transition-all duration-200 active:scale-[0.99]"
          >
            <span className="text-white font-medium">Haptic Feedback</span>
            <div className={`w-11 h-6 rounded-full relative transition-colors ${
              hapticEnabled ? 'bg-purple-600' : 'bg-gray-600'
            }`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                hapticEnabled ? 'right-0.5' : 'left-0.5'
              }`}></div>
            </div>
          </button>
          
          <button 
            onClick={handlePrivacyPolicy}
            className="w-full flex items-center justify-between p-4 hover:bg-dark-800/30 transition-all duration-200 active:scale-[0.99]"
          >
            <span className="text-white font-medium">Privacy Policy</span>
            <span className="text-white/40 text-lg">→</span>
          </button>
          
          <button 
            onClick={handleTermsOfService}
            className="w-full flex items-center justify-between p-4 hover:bg-dark-800/30 transition-all duration-200 active:scale-[0.99]"
          >
            <span className="text-white font-medium">Terms of Service</span>
            <span className="text-white/40 text-lg">→</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-4 hover:bg-red-500/10 transition-all duration-200 active:scale-[0.99] text-red-400 hover:text-red-300 font-medium"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;