import React, { useState } from 'react';
import { History } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTelegram } from '../hooks/useTelegram';
import { GeneratedImage } from '../types';
import GenerationCard from '../components/GenerationCard';
import ImageViewer from '../components/ImageViewer';
import ApiService from '../services/apiService';

const HistoryPage: React.FC = () => {
  const { generationHistory, showToast } = useAppContext();
  const { hapticFeedback } = useTelegram();
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  
  const apiService = ApiService.getInstance();

  const handleImageClick = (image: GeneratedImage) => {
    hapticFeedback('light');
    setSelectedImage(image);
    setIsImageViewerOpen(true);
  };

  const handleCloseImageViewer = () => {
    hapticFeedback('light');
    setIsImageViewerOpen(false);
    setSelectedImage(null);
  };

  const handleDownloadImage = async (image: GeneratedImage) => {
    console.log(`🎯 Download button clicked for image:`, image);
    hapticFeedback('medium');
    
    try {
      console.log(`📤 Calling downloadImageToTelegram with ID: ${image.id}`);
      const result = await apiService.downloadImageToTelegram(image.id);
      
      console.log(`📥 Download result:`, result);
      
      if (result.success) {
        console.log(`✅ Download successful, closing image viewer`);
        // Close the image viewer on successful download
        handleCloseImageViewer();
        
        showToast({
          type: 'success',
          title: 'Image Sent!',
          message: 'Image has been sent to your Telegram chat.',
          duration: 3000
        });
      } else {
        console.error(`❌ Download failed:`, result.message || result.error);
        
        showToast({
          type: 'error',
          title: 'Download Failed',
          message: result.message || 'Unable to send image to Telegram. Please try again.',
          duration: 5000
        });
      }
    } catch (error) {
      console.error(`💥 Download error:`, error);
      
      showToast({
        type: 'error',
        title: 'Download Error',
        message: 'Network error occurred while sending image. Please try again.',
        duration: 5000
      });
    }
  };

  return (
    <div className="pb-8 space-y-6">
      <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in-scale">
        <div className="w-10 h-10 bg-dark-800/50 border border-dark-700 rounded-2xl flex items-center justify-center">
          <History size={20} className="text-white/80" />
        </div>
        <h2 className="text-xl font-semibold text-white">Generation History</h2>
      </div>
      
      <div className="space-y-4">
        {generationHistory.map((generation, index) => (
          <div 
            key={generation.id}
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <GenerationCard
              images={generation.images}
              timestamp={generation.timestamp}
              onImageClick={handleImageClick}
            />
          </div>
        ))}
      </div>

      <ImageViewer
        image={selectedImage}
        isOpen={isImageViewerOpen}
        onClose={handleCloseImageViewer}
        onDownload={handleDownloadImage}
      />
    </div>
  );
};

export default HistoryPage;