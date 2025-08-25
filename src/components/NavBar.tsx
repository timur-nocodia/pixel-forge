import React, { useState, useRef, useEffect } from 'react';
import { Home, Image, History, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTelegram } from '../hooks/useTelegram';

interface NavBarProps {
  // No props needed - using context
}

const NavBar: React.FC<NavBarProps> = () => {
  const { activeTab, setActiveTab } = useAppContext();
  const { hapticFeedback } = useTelegram();
  const [bubbleStyle, setBubbleStyle] = useState({});
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const activeIndex = navItems.findIndex(item => item.id === activeTab);

  useEffect(() => {
    updateBubblePosition(activeIndex);
  }, [activeIndex]);

  const updateBubblePosition = (index: number) => {
    const activeItem = itemRefs.current[index];
    if (activeItem && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      
      const left = itemRect.left - navRect.left;
      const width = itemRect.width;
      
      setBubbleStyle({
        left: `${left}px`,
        width: `${width}px`,
      });
    }
  };

  const handleItemClick = (itemId: string) => {
    hapticFeedback('light');
    setActiveTab(itemId);
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 z-40">
      <nav 
        ref={navRef}
        className="relative flex items-center justify-between bg-black/20 backdrop-blur-md rounded-full p-2 shadow-2xl border border-white/10 w-full"
      >
        {/* Animated bubble background */}
        <div
          className="absolute top-2 bottom-2 bg-white/90 rounded-full transition-all duration-500 ease-out shadow-lg"
          style={bubbleStyle}
        />
        
        {/* Navigation items */}
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = item.id === activeTab;
          
          return (
            <button
              key={item.id}
              ref={el => itemRefs.current[index] = el}
              onClick={() => handleItemClick(item.id)}
              className={`
                relative z-10 flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500 ease-out flex-1 justify-center
                ${isActive 
                  ? 'text-gray-800 font-medium' 
                  : 'text-white/70 hover:text-white/90'
                }
              `}
            >
              {/* Icon with smooth color transition */}
              <IconComponent 
                size={20} 
                className={`transition-colors duration-500 ease-out ${
                  isActive ? 'text-gray-800' : 'text-white/70'
                }`}
              />
              
              {/* Text label - only show for active item */}
              {isActive && (
                <span className="text-sm font-medium text-gray-800 transition-all duration-300 ease-out whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default NavBar;