import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Wifi, RefreshCw } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, error, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold">PF</span>
          </div>
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-white/70">Connecting to Telegram...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold">PF</span>
          </div>
          <Wifi className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connection Issue</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={login}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold">PF</span>
          </div>
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-white/70">Setting up your account...</p>
          <button
            onClick={login}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            Login with Telegram
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;