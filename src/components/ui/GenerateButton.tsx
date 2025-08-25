import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTelegram } from '../../hooks/useTelegram';

interface GenerateButtonProps {
  onGenerate: () => void;
  isGenerating?: boolean;
  disabled?: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ 
  onGenerate, 
  isGenerating = false, 
  disabled = false 
}) => {
  const { hapticFeedback, notificationFeedback } = useTelegram();

  const handleGenerate = () => {
    if (disabled || isGenerating) {
      return;
    }
    
    hapticFeedback('heavy');
    onGenerate();
  };

  return (
    <button 
      onClick={handleGenerate}
      disabled={disabled || isGenerating}
      className={`relative w-full py-4 rounded-3xl font-bold text-lg shadow-xl transition-all duration-200 overflow-hidden ${
        disabled || isGenerating
          ? 'bg-dark-700 cursor-not-allowed opacity-50 text-white/50'
          : 'bg-gradient-to-r from-accent-400 to-accent-500 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] hover:from-accent-300 hover:to-accent-400 text-dark-950'
      }`}
    >
      {!disabled && !isGenerating && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isGenerating && <Loader2 size={20} className="animate-spin text-white" />}
        {isGenerating ? 'GENERATING...' : 'GENERATE'}
      </span>
    </button>
  );
};

export default GenerateButton;