import React from 'react';
import { ArtStyle } from '../../types';
import { useTelegram } from '../../hooks/useTelegram';

interface ArtStyleSelectorProps {
  artStyles: ArtStyle[];
  selectedStyle: string;
  isExpanded: boolean;
  onStyleSelect: (styleId: string) => void;
  onToggleExpanded: () => void;
}

const ArtStyleSelector: React.FC<ArtStyleSelectorProps> = ({
  artStyles,
  selectedStyle,
  isExpanded,
  onStyleSelect,
  onToggleExpanded
}) => {
  const { hapticFeedback } = useTelegram();

  const handleStyleSelect = (styleId: string) => {
    hapticFeedback('light');
    onStyleSelect(styleId);
  };

  const handleToggleExpanded = () => {
    hapticFeedback('light');
    onToggleExpanded();
  };

  const visibleStyles = artStyles.slice(0, 4);
  const hiddenStyles = artStyles.slice(4);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Art Style</h2>
        <button 
          onClick={handleToggleExpanded}
          className="text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors active:scale-95 px-3 py-1 rounded-full bg-yellow-400/10 hover:bg-yellow-400/20"
        >
          {isExpanded ? 'Show less' : 'See all'}
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {/* Always visible styles */}
        {visibleStyles.map((style, index) => (
          <div key={style.id} className="flex flex-col items-center">
            <button
              onClick={() => handleStyleSelect(style.id)}
              className={`w-full aspect-square border-2 rounded-3xl flex items-center justify-center backdrop-blur-sm mb-2 transition-all duration-300 active:scale-95 overflow-hidden ${
                selectedStyle === style.id
                  ? 'bg-yellow-400/20 border-yellow-400 shadow-lg'
                  : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
              }`}
            >
              {style.image ? (
                <img 
                  src={style.image} 
                  alt={style.label}
                  className="w-full h-full object-cover rounded-2xl opacity-90 hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="w-8 h-8 border-2 border-white/20 rounded-2xl relative bg-gray-700/50">
                  <div className="absolute inset-1 bg-white/5 rounded-xl"></div>
                  <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-white/40 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                </div>
              )}
            </button>
            <p className="text-xs text-center text-white/60 leading-tight px-1 break-words font-medium">{style.label}</p>
          </div>
        ))}
        
        {/* Expandable hidden styles with smooth animation */}
        <div className={`col-span-4 grid grid-cols-4 gap-3 overflow-hidden transition-all duration-500 ease-out ${
          isExpanded 
            ? 'max-h-96 opacity-100 transform translate-y-0' 
            : 'max-h-0 opacity-0 transform -translate-y-4'
        }`}>
          {hiddenStyles.map((style, index) => (
            <div 
              key={style.id} 
              className={`flex flex-col items-center transition-all duration-300 ease-out ${
                isExpanded 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform translate-y-2 scale-95'
              }`}
              style={{ 
                transitionDelay: isExpanded ? `${index * 50}ms` : '0ms' 
              }}
            >
              <button
                onClick={() => handleStyleSelect(style.id)}
                className={`w-full aspect-square border-2 rounded-3xl flex items-center justify-center backdrop-blur-sm mb-2 transition-all duration-300 active:scale-95 overflow-hidden ${
                  selectedStyle === style.id
                    ? 'bg-yellow-400/20 border-yellow-400 shadow-lg'
                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                }`}
              >
                {style.image ? (
                  <img 
                    src={style.image} 
                    alt={style.label}
                    className="w-full h-full object-cover rounded-2xl opacity-90 hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-8 h-8 border-2 border-white/20 rounded-2xl relative bg-gray-700/50">
                    <div className="absolute inset-1 bg-white/5 rounded-xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-white/40 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                  </div>
                )}
              </button>
              <p className="text-xs text-center text-white/60 leading-tight px-1 break-words font-medium">{style.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtStyleSelector;