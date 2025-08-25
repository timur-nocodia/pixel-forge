import React from 'react';
import { Bell } from 'lucide-react';
import { useTelegram } from '../../hooks/useTelegram';

const Header: React.FC = () => {
  const { hapticFeedback } = useTelegram();

  return (
    <div className="flex items-center justify-between p-4 pt-16 pb-8">
      <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-dark-950 font-bold text-lg">PF</span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-white">PixelForge</h1>
      <button 
        onClick={() => hapticFeedback('light')}
        className="w-10 h-10 bg-dark-800/80 border border-dark-700 rounded-2xl flex items-center justify-center backdrop-blur-sm hover:bg-dark-700/80 transition-all active:scale-95"
      >
        <Bell size={18} className="text-white/80" />
      </button>
    </div>
  );
};

export default Header;