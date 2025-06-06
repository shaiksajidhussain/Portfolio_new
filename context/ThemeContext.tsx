'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  currentTheme: string | null;
  customBackground: string | null;
  isThemesEnabled: boolean;
  setTheme: (theme: string) => void;
  setCustomBackground: (background: string | null) => void;
  toggleThemes: () => void;
}

// Default theme if none is set
const DEFAULT_THEME = '#191924';

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: DEFAULT_THEME,
  customBackground: null,
  isThemesEnabled: true,
  setTheme: () => {},
  setCustomBackground: () => {},
  toggleThemes: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with default values
  const [currentTheme, setCurrentTheme] = useState<string | null>(DEFAULT_THEME);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [isThemesEnabled, setIsThemesEnabled] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved preferences
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      const savedBackground = localStorage.getItem('customBackground');
      const savedThemesEnabled = localStorage.getItem('isThemesEnabled');
      
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
      if (savedBackground) {
        setCustomBackground(savedBackground);
      }
      if (savedThemesEnabled !== null) {
        setIsThemesEnabled(savedThemesEnabled === 'true');
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setTheme = (theme: string) => {
    try {
      setCurrentTheme(theme);
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setCustomBackgroundImage = (background: string | null) => {
    try {
      setCustomBackground(background);
      if (background) {
        localStorage.setItem('customBackground', background);
      } else {
        localStorage.removeItem('customBackground');
      }
    } catch (error) {
      console.error('Error saving custom background:', error);
    }
  };

  const toggleThemes = () => {
    try {
      const newValue = !isThemesEnabled;
      setIsThemesEnabled(newValue);
      localStorage.setItem('isThemesEnabled', String(newValue));
    } catch (error) {
      console.error('Error toggling themes:', error);
    }
  };

  // Don't render children until we've loaded the saved preferences
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        customBackground,
        isThemesEnabled,
        setTheme,
        setCustomBackground: setCustomBackgroundImage,
        toggleThemes
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 