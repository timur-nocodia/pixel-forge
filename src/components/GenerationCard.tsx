import React from 'react';
import { GeneratedImage } from '../types';

interface GenerationCardProps {
  images: GeneratedImage[];
  timestamp: string;
  onImageClick: (image: GeneratedImage) => void;
  isLoading?: boolean;
}

const GenerationCard: React.FC<GenerationCardProps> = ({ images, timestamp, onImageClick, isLoading = false }) => {
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-dark-900/50 border border-dark-800 rounded-3xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        {isLoading ? (
          <>
            <div className="h-4 bg-dark-700/50 rounded-xl animate-pulse w-20"></div>
            <div className="h-3 bg-dark-700/50 rounded-xl animate-pulse w-16"></div>
          </>
        ) : (
          <>
            <span className="text-sm text-white/60 font-medium">{formatRelativeTime(timestamp)}</span>
            <span className="text-xs text-white/40 font-medium bg-dark-800/50 px-2 py-1 rounded-full">{images.length} images</span>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl bg-dark-700/30 animate-pulse border border-dark-700/50"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-dark-600/20 to-transparent rounded-2xl"></div>
            </div>
          ))
        ) : (
          // Actual images
          images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageClick(image)}
              className="relative aspect-square rounded-2xl overflow-hidden bg-dark-800/30 border border-dark-700/50 hover:border-dark-600 transition-all active:scale-95 hover:shadow-lg"
            >
              <img 
                src={image.url} 
                alt={`Generated image ${index + 1}`}
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/40 to-transparent"></div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default GenerationCard;