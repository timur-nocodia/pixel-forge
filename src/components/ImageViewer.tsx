import React, { useState, useEffect, useRef } from 'react';
import { X, Download } from 'lucide-react';
import { GeneratedImage } from '../types';
import { useAppContext } from '../context/AppContext';

interface ImageViewerProps {
  image: GeneratedImage | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (image: GeneratedImage) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ image, isOpen, onClose, onDownload }) => {
  const { generationHistory } = useAppContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<GeneratedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isProcessingSwipe, setIsProcessingSwipe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Configuration
  const SWIPE_THRESHOLD = 50; // Minimum distance to trigger swipe
  const VELOCITY_THRESHOLD = 0.3; // Minimum velocity for quick swipes
  const RESISTANCE_FACTOR = 0.3; // Resistance at edges

  // Flatten all images from generation history
  useEffect(() => {
    const images = generationHistory.flatMap(gen => gen.images);
    setAllImages(images);
  }, [generationHistory]);

  // Find current image index when image changes
  useEffect(() => {
    if (image && allImages.length > 0) {
      const index = allImages.findIndex(img => img.id === image.id);
      if (index !== -1) {
        setCurrentImageIndex(index);
      }
    }
  }, [image, allImages]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsDragging(false);
      setDragOffset(0);
      setStartX(0);
      setStartTime(0);
    }
  }, [isOpen]);

  const currentImage = allImages[currentImageIndex] || image;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (allImages.length <= 1) return;
    if (isProcessingSwipe) return;
    
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartTime(Date.now());
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || allImages.length <= 1) return;
    if (isProcessingSwipe) return;
    
    const touch = e.touches[0];
    let deltaX = touch.clientX - startX;
    
    // Apply resistance at edges
    const isAtStart = currentImageIndex === 0;
    const isAtEnd = currentImageIndex === allImages.length - 1;
    
    if ((isAtStart && deltaX > 0) || (isAtEnd && deltaX < 0)) {
      deltaX *= RESISTANCE_FACTOR;
    }
    
    setDragOffset(deltaX);
    
    // Prevent default to avoid scrolling
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging || allImages.length <= 1) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    
    if (isProcessingSwipe) {
      return;
    }
    
    setIsProcessingSwipe(true);
    
    // Simple single-step logic: only move one image at a time
    let newIndex = currentImageIndex;
    
    // Check if swipe distance is enough to trigger navigation
    if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      if (dragOffset < 0 && currentImageIndex < allImages.length - 1) {
        // Swipe left - go to NEXT image (only one step)
        newIndex = currentImageIndex + 1;
      } else if (dragOffset > 0 && currentImageIndex > 0) {
        // Swipe right - go to PREVIOUS image (only one step)
        newIndex = currentImageIndex - 1;
      }
    }
    
    // Update state
    setCurrentImageIndex(newIndex);
    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
    setStartTime(0);
    
    // Reset processing flag after transition
    setTimeout(() => {
      setIsProcessingSwipe(false);
    }, 350); // Slightly longer than transition duration
  };

  const handleMouseStart = (e: React.MouseEvent) => {
    if (allImages.length <= 1) return;
    if (isProcessingSwipe) return;
    
    setStartX(e.clientX);
    setStartTime(Date.now());
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || allImages.length <= 1) return;
    if (isProcessingSwipe) return;
    
    let deltaX = e.clientX - startX;
    
    // Apply resistance at edges
    const isAtStart = currentImageIndex === 0;
    const isAtEnd = currentImageIndex === allImages.length - 1;
    
    if ((isAtStart && deltaX > 0) || (isAtEnd && deltaX < 0)) {
      deltaX *= RESISTANCE_FACTOR;
    }
    
    setDragOffset(deltaX);
  };

  const handleMouseEnd = () => {
    if (!isDragging || allImages.length <= 1) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    
    if (isProcessingSwipe) {
      return;
    }
    
    setIsProcessingSwipe(true);
    
    // Simple single-step logic: only move one image at a time
    let newIndex = currentImageIndex;
    
    // Check if swipe distance is enough to trigger navigation
    if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      if (dragOffset < 0 && currentImageIndex < allImages.length - 1) {
        // Swipe left - go to NEXT image (only one step)
        newIndex = currentImageIndex + 1;
      } else if (dragOffset > 0 && currentImageIndex > 0) {
        // Swipe right - go to PREVIOUS image (only one step)
        newIndex = currentImageIndex - 1;
      }
    }
    
    // Update state
    setCurrentImageIndex(newIndex);
    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
    setStartTime(0);
    
    // Reset processing flag after transition
    setTimeout(() => {
      setIsProcessingSwipe(false);
    }, 350); // Slightly longer than transition duration
  };

  if (!isOpen || !currentImage) return null;

  const handleDownload = () => {
    console.log(`🔽 ImageViewer download button clicked for image:`, currentImage);
    onDownload(currentImage);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDragging) {
      onClose();
    }
  };

  // Calculate transform for the carousel
  const imageWidthPercent = 100 / allImages.length;
  const baseTransform = -currentImageIndex * imageWidthPercent;
  const dragTransform = isDragging ? (dragOffset / window.innerWidth) * imageWidthPercent : 0;
  const totalTransform = baseTransform + dragTransform;

  return (
    <div 
      className="fixed inset-0 bg-dark-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Image and buttons container */}
      <div className="flex flex-col items-center justify-center max-w-full max-h-full">
        {/* Image container with carousel */}
        <div 
          ref={containerRef}
          className="relative max-w-full max-h-[calc(100vh-120px)] overflow-hidden"
        >
          {/* Navigation indicators */}
          {allImages.length > 1 && (
            <div className="absolute top-4 right-4 bg-dark-900/80 backdrop-blur-sm rounded-full px-3 py-1 text-white/80 text-sm font-medium z-10">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          )}
          
          {/* Carousel container */}
          <div 
            className="flex"
            style={{
              transform: `translateX(${totalTransform}%)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              width: `${allImages.length * 100}%`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseStart}
            onMouseMove={isDragging ? handleMouseMove : undefined}
            onMouseUp={handleMouseEnd}
            onMouseLeave={handleMouseEnd}
          >
            {allImages.map((img, index) => (
              <div 
                key={img.id}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: `${100 / allImages.length}%` }}
              >
                <img 
                  src={img.url} 
                  alt={`Image ${index + 1}`}
                  className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl select-none"
                  draggable={false}
                  style={{
                    opacity: isDragging ? 0.9 : 1,
                    transition: isDragging ? 'none' : 'opacity 0.3s ease-out',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Action buttons under the image */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={onClose}
            className="w-12 h-12 bg-dark-800/80 border border-dark-700 rounded-2xl flex items-center justify-center backdrop-blur-sm hover:bg-dark-700/80 transition-colors shadow-lg"
          >
            <X size={24} className="text-white" />
          </button>
          
          <button
            onClick={handleDownload}
            className="w-12 h-12 bg-yellow-400/20 border border-yellow-400/50 rounded-2xl flex items-center justify-center backdrop-blur-sm hover:bg-yellow-400/30 transition-colors shadow-lg"
          >
            <Download size={24} className="text-yellow-400" />
          </button>
        </div>
        
        {/* Swipe hint */}
        {allImages.length > 1 && (
          <p className="text-white/50 text-sm mt-4 text-center">
            Swipe left or right to navigate between images
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;