'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: 'blue', color: '#0056B3' },
    { name: 'emerald', color: '#10B981' },
    { name: 'rose', color: '#F43F5E' },
    { name: 'amber', color: '#F59E0B' },
    { name: 'violet', color: '#8B5CF6' }
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Theme Color
        </h3>
        <div className="flex gap-2">
          {themes.map((t) => (
            <motion.button
              key={t.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(t.name as any)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                theme === t.name
                  ? 'border-gray-900 dark:border-white scale-110'
                  : 'border-transparent'
              }`}
              style={{ backgroundColor: t.color }}
              aria-label={`Switch to ${t.name} theme`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector 