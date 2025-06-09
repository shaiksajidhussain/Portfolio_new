'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import Modal from './Modal'
import { useMediaQuery } from 'react-responsive'

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeSelect: (theme: string) => void;
  onCustomBackground: (background: string | null) => void;
}

const gradients = [
  {
    name: 'Midnight Violet',
    value: 'linear-gradient(135deg, #1e003c, #4b0082)',
    colors: ['#1e003c', '#4b0082']
  },
  {
    name: 'Purple Nebula',
    value: 'linear-gradient(120deg, #3e1e68, #9b34ef)',
    colors: ['#3e1e68', '#9b34ef']
  },
  {
    name: 'Electric Indigo',
    value: 'linear-gradient(135deg, #5b0eeb, #2b124c)',
    colors: ['#5b0eeb', '#2b124c']
  },
  {
    name: 'Cosmic Dream',
    value: 'linear-gradient(135deg, #1f1c2c, #928dab)',
    colors: ['#1f1c2c', '#928dab']
  },
  {
    name: 'Royal Ocean',
    value: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    colors: ['#0f2027', '#203a43', '#2c5364']
  },
  {
    name: 'Cyber Grape',
    value: 'linear-gradient(135deg, #3a0ca3, #7209b7)',
    colors: ['#3a0ca3', '#7209b7']
  },
  {
    name: 'Foggy Night',
    value: 'linear-gradient(135deg, #2d2d44, #5c5470)',
    colors: ['#2d2d44', '#5c5470']
  },
  {
    name: 'Sunset Boulevard',
    value: 'linear-gradient(135deg, #ff6e7f, #bfe9ff)',
    colors: ['#ff6e7f', '#bfe9ff']
  },
  {
    name: 'Aurora Glow',
    value: 'linear-gradient(135deg, #8e2de2, #4a00e0)',
    colors: ['#8e2de2', '#4a00e0']
  },
  {
    name: 'Emerald Forest',
    value: 'linear-gradient(135deg, #134E5E, #71B280)',
    colors: ['#134E5E', '#71B280']
  },
  {
    name: 'Desert Mirage',
    value: 'linear-gradient(135deg, #FF9966, #FF5E62)',
    colors: ['#FF9966', '#FF5E62']
  },
  {
    name: 'Northern Lights',
    value: 'linear-gradient(135deg, #43cea2, #185a9d)',
    colors: ['#43cea2', '#185a9d']
  },
  {
    name: 'Deep Space',
    value: 'linear-gradient(135deg, #000000, #434343)',
    colors: ['#000000', '#434343']
  },
  {
    name: 'Cherry Blossom',
    value: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
    colors: ['#FFB6C1', '#FF69B4']
  },
  {
    name: 'Ocean Breeze',
    value: 'linear-gradient(135deg, #2193b0, #6dd5ed)',
    colors: ['#2193b0', '#6dd5ed']
  },
  {
    name: 'Golden Hour',
    value: 'linear-gradient(135deg, #f6d365, #fda085)',
    colors: ['#f6d365', '#fda085']
  },
  {
    name: 'Mystic Night',
    value: 'linear-gradient(135deg, #232526, #414345)',
    colors: ['#232526', '#414345']
  },
  {
    name: 'Tropical Paradise',
    value: 'linear-gradient(135deg, #11998e, #38ef7d)',
    colors: ['#11998e', '#38ef7d']
  },
  {
    name: 'Vibrant Sunset',
    value: 'linear-gradient(135deg, #D4145A, #FBB03B)',
    colors: ['#D4145A', '#FBB03B']
  },
  {
    name: 'Midnight Ocean',
    value: 'linear-gradient(135deg, #000000, #00BFFF)',
    colors: ['#000000', '#00BFFF']
  },
  {
    name: 'Deep Sea',
    value: 'linear-gradient(135deg, #000000, #1E90FF)',
    colors: ['#000000', '#1E90FF']
  },
  {
    name: 'Arctic Night',
    value: 'linear-gradient(135deg, #000000, #87CEEB)',
    colors: ['#000000', '#87CEEB']
  },
  {
    name: 'Ocean Depth',
    value: 'linear-gradient(135deg, #000000, #4169E1)',
    colors: ['#000000', '#4169E1']
  },
  {
    name: 'Twilight Blue',
    value: 'linear-gradient(135deg, #000000, #00CED1)',
    colors: ['#000000', '#00CED1']
  },
  {
    name: 'Neon Night',
    value: 'linear-gradient(135deg, #000000, #00FFFF)',
    colors: ['#000000', '#00FFFF']
  },
  {
    name: 'Royal Blue',
    value: 'linear-gradient(135deg, #000000, #0000FF)',
    colors: ['#000000', '#0000FF']
  },
  {
    name: 'Dark Elegance',
    value: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
    colors: ['#1a1a1a', '#2d2d2d']
  },
  {
    name: 'Obsidian',
    value: 'linear-gradient(135deg, #000000, #1a1a1a)',
    colors: ['#000000', '#1a1a1a']
  },
  {
    name: 'Dark Chocolate',
    value: 'linear-gradient(135deg, #1a0f0f, #2d1810)',
    colors: ['#1a0f0f', '#2d1810']
  },
  {
    name: 'Midnight Forest',
    value: 'linear-gradient(135deg, #0a0a0a, #1a2f1a)',
    colors: ['#0a0a0a', '#1a2f1a']
  },
  {
    name: 'Dark Maroon',
    value: 'linear-gradient(135deg, #1a0000, #330000)',
    colors: ['#1a0000', '#330000']
  },
  {
    name: 'Deep Purple',
    value: 'linear-gradient(135deg, #0a0a0a, #1a0033)',
    colors: ['#0a0a0a', '#1a0033']
  },
  {
    name: 'Dark Slate',
    value: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
    colors: ['#1a1a1a', '#2d2d2d']
  },
  {
    name: 'Charcoal',
    value: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
    colors: ['#0a0a0a', '#1a1a1a']
  }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  isOpen,
  onClose,
  onThemeSelect,
  onCustomBackground,
}) => {
  const { currentTheme } = useTheme();
  const isMobile = useMediaQuery({ maxWidth: 600 });

  // Filter themes based on screen size
  const displayThemes = isMobile ? gradients : gradients.slice(0, 25); // Show only first 8 themes on desktop

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Theme">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 min-h-[200px]">
        {displayThemes.map((gradient) => (
          <motion.button
            key={gradient.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`h-28 md:h-32 rounded-lg overflow-hidden relative group ${
              currentTheme === gradient.value ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-[#1E1E2D]' : ''
            }`}
            onClick={() => {
              onThemeSelect(gradient.value);
              onCustomBackground(null);
            }}
            style={{ background: gradient.value }}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-black/60 to-transparent">
              <span className="text-white text-xs md:text-sm font-medium block truncate">
                {gradient.name}
              </span>
              <div className="flex gap-1 mt-1">
                {gradient.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </Modal>
  );
};

export default ThemeSelector 