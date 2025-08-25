import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTelegram } from '../hooks/useTelegram';
import { ArtStyle, GeneratedImage } from '../types';
import GenerationCard from '../components/GenerationCard';
import ApiService from '../services/apiService';
import PromptInput from '../components/ui/PromptInput';
import GenerateButton from '../components/ui/GenerateButton';
import ArtStyleSelector from '../components/ui/ArtStyleSelector';
import ImageViewer from '../components/ImageViewer';

const HomePage: React.FC = () => {
  const { tg, hapticFeedback } = useTelegram();
  const { generationHistory, setGenerationHistory, showToast } = useAppContext();
  const [prompt, setPrompt] = useState("An anime boy strikes a pose in front of a moody cityscape, his hair a deep shade of blue and his eyes sharp and confident.");
  const [isStylesExpanded, setIsStylesExpanded] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('none');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingGeneration, setPendingGeneration] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  
  const apiService = ApiService.getInstance();

  const artStyles: ArtStyle[] = [
    { id: 'none', label: 'No Style', image: null },
    { id: 'anime', label: 'Anime', image: 'https://images.pexels.com/photos/2693529/pexels-photo-2693529.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 'fantasy', label: 'Fantasy', image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 'sci-fi', label: 'Sci-Fi', image: 'https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 'realistic', label: 'Realistic', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 'abstract', label: 'Abstract', image: 'https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 'cartoon', label: 'Cartoon', image: 'https://images.pexels.com/photos/1998594/pexels-photo-1998594.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 'cyberpunk', label: 'Cyberpunk', image: 'https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }
  ];

  const handleEnhancePrompt = () => {
    hapticFeedback('light');
  };

  const handleGenerate = async () => {
    if (isGenerating || !prompt.trim()) {
      if (!prompt.trim()) {
        showToast({
          type: 'warning',
          title: 'Empty Prompt',
          message: 'Please enter a description for your image before generating.',
          duration: 3000
        });
      }
      return;
    }
    
    setIsGenerating(true);
    hapticFeedback('heavy');
    
    // Create a pending generation with skeleton loading
    const pendingGen = {
      id: Date.now(),
      images: [],
      timestamp: new Date().toISOString(),
      isLoading: true
    };
    
    setPendingGeneration(pendingGen);
    setGenerationHistory(prev => [pendingGen, ...prev]);
    
    try {
      const result = await apiService.generateImage(prompt.trim(), selectedStyle);
      
      if (result.success && result.image_urls) {
        // Update the pending generation with actual images
        const newGeneration = {
          id: pendingGen.id,
          images: result.image_urls,
          timestamp: pendingGen.timestamp,
          isLoading: false
        };
        
        // Replace the pending generation with the completed one
        setGenerationHistory(prev => 
          prev.map(gen => gen.id === pendingGen.id ? newGeneration : gen)
        );
        
        showToast({
          type: 'success',
          title: 'Images Generated!',
          message: `Successfully created ${result.image_urls.length} images.`,
          duration: 3000
        });
      } else {
        // Remove the pending generation on failure
        setGenerationHistory(prev => 
          prev.filter(gen => gen.id !== pendingGen.id)
        );
        
        showToast({
          type: 'error',
          title: 'Generation Failed',
          message: result.message || 'Something went wrong with the server. Please try again later.',
          duration: 5000
        });
      }
    } catch (error) {
      // Remove the pending generation on error
      setGenerationHistory(prev => 
        prev.filter(gen => gen.id !== pendingGen.id)
      );
      
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your connection and try again.',
        duration: 5000
      });
    } finally {
      setIsGenerating(false);
      setPendingGeneration(null);
    }
  };

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

  // Get the most recent generation (first in array)
  const latestGeneration = generationHistory[0];

  return (
    <div className="space-y-8">
      <div className="opacity-0 animate-fade-in-scale">
        <PromptInput
          prompt={prompt}
          onPromptChange={setPrompt}
          onEnhancePrompt={handleEnhancePrompt}
        />
      </div>

      <div className="opacity-0 animate-fade-in-scale animate-delay-100">
        <GenerateButton 
          onGenerate={handleGenerate} 
          isGenerating={isGenerating}
          disabled={!prompt.trim() || isGenerating}
        />
      </div>

      <div className="opacity-0 animate-fade-in-scale animate-delay-200">
        <ArtStyleSelector
          artStyles={artStyles}
          selectedStyle={selectedStyle}
          isExpanded={isStylesExpanded}
          onStyleSelect={setSelectedStyle}
          onToggleExpanded={() => setIsStylesExpanded(!isStylesExpanded)}
        />
      </div>

      {/* Show latest generation results */}
      {latestGeneration && (
        <div className="opacity-0 animate-fade-in-up animate-delay-300">
          <h2 className="text-lg font-semibold mb-4 text-white">Generated Images</h2>
          <GenerationCard
            images={latestGeneration.images}
            timestamp={latestGeneration.timestamp}
            onImageClick={handleImageClick}
            isLoading={latestGeneration.isLoading}
          />
        </div>
      )}

      <ImageViewer
        image={selectedImage}
        isOpen={isImageViewerOpen}
        onClose={handleCloseImageViewer}
        onDownload={handleDownloadImage}
      />
    </div>
  );
};

export default HomePage;