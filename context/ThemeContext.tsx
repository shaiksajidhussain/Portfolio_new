'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  currentTheme: string | null;
  customBackground: string | null;
  setTheme: (theme: string) => void;
  setCustomBackground: (background: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [customBackground, setCustomBackground] = useState<string | null>(null);

  useEffect(() => {
    // Load saved theme from localStorage if available
    const savedTheme = localStorage.getItem('theme');
    const savedBackground = localStorage.getItem('customBackground');
    
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    if (savedBackground) {
      setCustomBackground(savedBackground);
    }
  }, []);

  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  const setCustomBackgroundImage = (background: string | null) => {
    setCustomBackground(background);
    if (background) {
      localStorage.setItem('customBackground', background);
    } else {
      localStorage.removeItem('customBackground');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        customBackground,
        setTheme,
        setCustomBackground: setCustomBackgroundImage,
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