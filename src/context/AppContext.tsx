import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Generation, GeneratedImage } from '../types';
import { AuthUser } from '../types/auth';
import { useToast } from '../hooks/useToast';

interface AppContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  generationHistory: Generation[];
  setGenerationHistory: (history: Generation[]) => void;
  showToast: (options: { type: 'success' | 'error' | 'warning' | 'info'; title: string; message?: string; duration?: number }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const { showToast } = useToast();
  const [generationHistory, setGenerationHistory] = useState<Generation[]>([
    {
      id: 1,
      images: [
        { id: 1, url: 'https://images.pexels.com/photos/2693529/pexels-photo-2693529.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
        { id: 2, url: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
        { id: 3, url: 'https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
        { id: 4, url: 'https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' }
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isLoading: false
    },
    {
      id: 2,
      images: [
        { id: 5, url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
        { id: 6, url: 'https://images.pexels.com/photos/1998594/pexels-photo-1998594.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
        { id: 7, url: 'https://images.pexels.com/photos/2693529/pexels-photo-2693529.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
        { id: 8, url: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' }
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: 3,
      images: [
        { id: 9, url: 'https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
        { id: 10, url: 'https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
        { id: 11, url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
        { id: 12, url: 'https://images.pexels.com/photos/1998594/pexels-photo-1998594.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' }
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
    },
    {
      id: 4,
      images: [
        { id: 13, url: 'https://images.pexels.com/photos/2693529/pexels-photo-2693529.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
        { id: 14, url: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
        { id: 15, url: 'https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
        { id: 16, url: 'https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' }
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
    }
  ]);

  const value = {
    user,
    setUser,
    activeTab,
    setActiveTab,
    generationHistory,
    setGenerationHistory,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};