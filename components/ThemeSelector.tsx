'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { Dialog } from '@headlessui/react'

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeSelect: (theme: string) => void;
}

const gradients = [
  {
    name: 'Purple Dream',
    value: 'linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%)',
    colors: ['#CC00BB', '#0046D1']
  },
  {
    name: 'Ocean Breeze',
    value: 'linear-gradient(38.73deg, rgba(0, 150, 255, 0.15) 0%, rgba(0, 100, 255, 0) 50%), linear-gradient(141.27deg, rgba(0, 200, 255, 0) 50%, rgba(0, 150, 255, 0.15) 100%)',
    colors: ['#0096FF', '#00C8FF']
  },
  {
    name: 'Sunset Glow',
    value: 'linear-gradient(38.73deg, rgba(255, 100, 0, 0.15) 0%, rgba(255, 50, 0, 0) 50%), linear-gradient(141.27deg, rgba(255, 150, 0, 0) 50%, rgba(255, 100, 0, 0.15) 100%)',
    colors: ['#FF6400', '#FF9600']
  },
  {
    name: 'Forest Mist',
    value: 'linear-gradient(38.73deg, rgba(0, 200, 100, 0.15) 0%, rgba(0, 150, 100, 0) 50%), linear-gradient(141.27deg, rgba(0, 255, 150, 0) 50%, rgba(0, 200, 100, 0.15) 100%)',
    colors: ['#00C864', '#00FF96']
  },
  {
    name: 'Midnight Sky',
    value: 'linear-gradient(38.73deg, rgba(75, 0, 130, 0.15) 0%, rgba(138, 43, 226, 0) 50%), linear-gradient(141.27deg, rgba(0, 0, 139, 0) 50%, rgba(0, 0, 255, 0.15) 100%)',
    colors: ['#4B0082', '#0000FF']
  },
  {
    name: 'Desert Sunset',
    value: 'linear-gradient(38.73deg, rgba(255, 69, 0, 0.15) 0%, rgba(255, 140, 0, 0) 50%), linear-gradient(141.27deg, rgba(255, 215, 0, 0) 50%, rgba(255, 165, 0, 0.15) 100%)',
    colors: ['#FF4500', '#FFA500']
  },
  {
    name: 'Northern Lights',
    value: 'linear-gradient(38.73deg, rgba(0, 255, 127, 0.15) 0%, rgba(0, 255, 255, 0) 50%), linear-gradient(141.27deg, rgba(0, 191, 255, 0) 50%, rgba(0, 255, 255, 0.15) 100%)',
    colors: ['#00FF7F', '#00FFFF']
  },
  {
    name: 'Royal Purple',
    value: 'linear-gradient(38.73deg, rgba(147, 112, 219, 0.15) 0%, rgba(138, 43, 226, 0) 50%), linear-gradient(141.27deg, rgba(148, 0, 211, 0) 50%, rgba(75, 0, 130, 0.15) 100%)',
    colors: ['#9370DB', '#9400D3']
  },
  {
    name: 'Fire Storm',
    value: 'linear-gradient(38.73deg, rgba(255, 0, 0, 0.15) 0%, rgba(255, 69, 0, 0) 50%), linear-gradient(141.27deg, rgba(255, 140, 0, 0) 50%, rgba(255, 165, 0, 0.15) 100%)',
    colors: ['#FF0000', '#FFA500']
  },
  {
    name: 'Ocean Depths',
    value: 'linear-gradient(38.73deg, rgba(0, 0, 139, 0.15) 0%, rgba(0, 0, 255, 0) 50%), linear-gradient(141.27deg, rgba(0, 191, 255, 0) 50%, rgba(0, 255, 255, 0.15) 100%)',
    colors: ['#00008B', '#00FFFF']
  },
  {
    name: 'Emerald Forest',
    value: 'linear-gradient(38.73deg, rgba(0, 100, 0, 0.15) 0%, rgba(0, 128, 0, 0) 50%), linear-gradient(141.27deg, rgba(0, 255, 0, 0) 50%, rgba(50, 205, 50, 0.15) 100%)',
    colors: ['#006400', '#32CD32']
  },
  {
    name: 'Cosmic Dust',
    value: 'linear-gradient(38.73deg, rgba(75, 0, 130, 0.15) 0%, rgba(138, 43, 226, 0) 50%), linear-gradient(141.27deg, rgba(148, 0, 211, 0) 50%, rgba(255, 0, 255, 0.15) 100%)',
    colors: ['#4B0082', '#FF00FF']
  },
  {
    name: 'Aurora Borealis',
    value: 'linear-gradient(38.73deg, rgba(0, 255, 255, 0.15) 0%, rgba(0, 255, 0, 0) 50%), linear-gradient(141.27deg, rgba(255, 0, 255, 0) 50%, rgba(255, 0, 0, 0.15) 100%)',
    colors: ['#00FFFF', '#FF0000']
  },
  {
    name: 'Twilight Zone',
    value: 'linear-gradient(38.73deg, rgba(75, 0, 130, 0.15) 0%, rgba(0, 0, 139, 0) 50%), linear-gradient(141.27deg, rgba(0, 0, 0, 0) 50%, rgba(25, 25, 112, 0.15) 100%)',
    colors: ['#4B0082', '#191970']
  },
  {
    name: 'Neon Dreams',
    value: 'linear-gradient(38.73deg, rgba(255, 0, 255, 0.15) 0%, rgba(0, 255, 255, 0) 50%), linear-gradient(141.27deg, rgba(0, 255, 0, 0) 50%, rgba(255, 255, 0, 0.15) 100%)',
    colors: ['#FF00FF', '#FFFF00']
  },
  {
    name: 'Mystic Fog',
    value: 'linear-gradient(38.73deg, rgba(128, 0, 128, 0.15) 0%, rgba(0, 0, 128, 0) 50%), linear-gradient(141.27deg, rgba(0, 0, 0, 0) 50%, rgba(72, 61, 139, 0.15) 100%)',
    colors: ['#800080', '#483D8B']
  },
  {
    name: 'Volcanic Ash',
    value: 'linear-gradient(38.73deg, rgba(139, 0, 0, 0.15) 0%, rgba(128, 0, 0, 0) 50%), linear-gradient(141.27deg, rgba(0, 0, 0, 0) 50%, rgba(47, 79, 79, 0.15) 100%)',
    colors: ['#8B0000', '#2F4F4F']
  },
  {
    name: 'Arctic Frost',
    value: 'linear-gradient(38.73deg, rgba(176, 224, 230, 0.15) 0%, rgba(135, 206, 235, 0) 50%), linear-gradient(141.27deg, rgba(0, 191, 255, 0) 50%, rgba(0, 206, 209, 0.15) 100%)',
    colors: ['#B0E0E6', '#00CED1']
  },
  {
    name: 'Golden Hour',
    value: 'linear-gradient(38.73deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0) 50%), linear-gradient(141.27deg, rgba(255, 140, 0, 0) 50%, rgba(255, 69, 0, 0.15) 100%)',
    colors: ['#FFD700', '#FF4500']
  },
  {
    name: 'Deep Space',
    value: 'linear-gradient(38.73deg, rgba(25, 25, 112, 0.15) 0%, rgba(0, 0, 0, 0) 50%), linear-gradient(141.27deg, rgba(0, 0, 0, 0) 50%, rgba(47, 79, 79, 0.15) 100%)',
    colors: ['#191970', '#2F4F4F']
  },
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
  }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  isOpen,
  onClose,
  onThemeSelect,
}) => {
  const { currentTheme } = useTheme();

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/75" aria-hidden="true" />
      <Dialog.Panel className="bg-[#1E1E2D] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] relative flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <Dialog.Title as="h2" className="text-2xl font-bold text-white">Select Theme</Dialog.Title>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Scrollable swatch grid */}
        <div className="overflow-y-scroll overflow-x-hidden h-[60vh]">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gradients.map((gradient) => (
              <motion.button
                key={gradient.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`h-32 rounded-lg overflow-hidden relative group ${
                  currentTheme === gradient.value ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-[#1E1E2D]' : ''
                }`}
                onClick={() => onThemeSelect(gradient.value)}
                style={{ background: gradient.value }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-white text-sm font-medium block">
                    {gradient.name}
                  </span>
                  <div className="flex gap-1 mt-1">
                    {gradient.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default ThemeSelector 