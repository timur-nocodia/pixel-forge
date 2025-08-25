import React, { useRef, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import { useTelegram } from '../../hooks/useTelegram';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onEnhancePrompt: () => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, onPromptChange, onEnhancePrompt }) => {
  const { hapticFeedback } = useTelegram();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      onPromptChange(value);
      adjustTextareaHeight();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleEnhancePrompt = () => {
    hapticFeedback('light');
    onEnhancePrompt();
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [prompt]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Input Prompt</h2>
        <button 
          onClick={() => hapticFeedback('light')}
          className="text-accent-400 text-sm font-medium hover:text-accent-300 transition-colors active:scale-95 px-3 py-1 rounded-full bg-accent-400/10 hover:bg-accent-400/20"
        >
          Explore
        </button>
      </div>
      
      <div className="relative bg-dark-900/50 rounded-3xl border border-dark-800 p-1">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handlePromptChange}
          className="w-full bg-transparent rounded-2xl p-4 pr-16 text-white placeholder-white/40 resize-none min-h-[120px] focus:outline-none auto-resize"
          placeholder="Describe your vision..."
          rows={4}
        />
        
        <div className="absolute bottom-16 right-4 text-xs text-white/30 font-medium">
          {prompt.length}/1000
        </div>
        
        <button 
          onClick={handleEnhancePrompt}
          className="absolute bottom-4 right-4 w-10 h-10 bg-gradient-to-r from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 hover:from-accent-300 hover:to-accent-400"
        >
          <Wand2 size={18} className="text-dark-950" />
        </button>
      </div>
    </div>
  );
};

export default PromptInput;