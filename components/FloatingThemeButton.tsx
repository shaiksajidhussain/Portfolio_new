'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ThemeSelector from './ThemeSelector'
import { useTheme } from '../context/ThemeContext'

const FloatingThemeButton = () => {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
  const { setTheme, setCustomBackground, isThemesEnabled, toggleThemes } = useTheme()

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-8 right-8 z-50 flex flex-col gap-4"
      >
        {/* Theme Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleThemes}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
            isThemesEnabled 
              ? 'bg-green-600 hover:bg-green-700 hover:shadow-green-500/25' 
              : 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/25'
          } text-white`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isThemesEnabled 
                ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              }
            />
          </svg>
        </motion.button>

        {/* Theme Selector Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsThemeModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        </motion.button>
      </motion.div>

      <ThemeSelector
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        onThemeSelect={setTheme}
        onCustomBackground={setCustomBackground}
      />
    </>
  )
}

export default FloatingThemeButton 