'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface FrameToggleProps {
  onToggle: (enabled: boolean) => void
  isEnabled: boolean
}

const FrameToggle = ({ onToggle, isEnabled }: FrameToggleProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleToggle = () => {
    onToggle(!isEnabled)
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.button
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative w-16 h-16 rounded-full border-2 transition-all duration-300 ease-in-out
          ${isEnabled 
            ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/30' 
            : 'bg-gray-700 border-gray-500 hover:border-gray-400'
          }
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}
        whileTap={{ scale: 0.95 }}
        aria-label={isEnabled ? 'Disable frame animation' : 'Enable frame animation'}
      >
        {/* Background circle with subtle animation */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: isEnabled ? [1, 1.1, 1] : 1,
            opacity: isEnabled ? [0.8, 1, 0.8] : 0.6
          }}
          transition={{
            duration: 2,
            repeat: isEnabled ? Infinity : 0,
            ease: "easeInOut"
          }}
          style={{
            background: isEnabled 
              ? 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.1) 70%, transparent 100%)'
              : 'radial-gradient(circle, rgba(107, 114, 128, 0.3) 0%, rgba(107, 114, 128, 0.1) 70%, transparent 100%)'
          }}
        />
        
        {/* Icon container */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {isEnabled ? (
            // Checkmark icon when enabled
            <motion.div
              initial={false}
              animate={{ 
                pathLength: 1,
                opacity: 1
              }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full"
              >
                <motion.path
                  d="M9 12l2 2 4-4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </svg>
            </motion.div>
          ) : (
            // Play icon when disabled
            <motion.div
              initial={false}
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                opacity: 0.8
              }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </motion.div>
          )}
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.2 }}
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none"
        >
          {isEnabled ? 'Disable Frame Animation' : 'Enable Frame Animation'}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </motion.div>

        {/* Loading indicator when transitioning */}
        {isEnabled && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-white"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ opacity: 0.3 }}
          />
        )}
      </motion.button>
    </div>
  )
}

export default FrameToggle

