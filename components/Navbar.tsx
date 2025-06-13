'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Blogs', href: '#blogs' },
    { name: 'Contact', href: '#contact' },
  ]

  // Animation variants for staggered appearance
  const itemVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <motion.nav
      initial="initial"
      animate="animate"
      className="fixed w-full bg-[#191924] z-50 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ 
                scale: 1.1,
                textShadow: "0 0 8px rgb(255,255,255)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="text-2xl font-bold relative group">
                <span className="relative z-10">Sajid Hussain</span>
                <motion.span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 rounded-lg"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            </motion.div>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.5, delay: navItems.length * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="https://github.com/shaiksajidhussain"
                  className="border border-purple-600 text-purple-300 hover:text-white hover:bg-purple-700 px-3 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Github Profile
                </Link>
              </motion.div>
              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.5, delay: (navItems.length + 1) * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="https://www.youtube.com/@codewithsanjuu"
                  className="border border-purple-600 text-purple-300 hover:text-white hover:bg-purple-700 px-3 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Youtube Profile
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial="initial"
          animate="animate"
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                variants={itemVariants}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.5, delay: (navItems.length) * 0.1 + 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="https://github.com/shaiksajidhussain"
                className="border border-purple-600 text-purple-300 hover:text-white hover:bg-purple-700 block px-3 py-2 rounded-full text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Github Profile
              </Link>
            </motion.div>
            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.5, delay: (navItems.length + 1) * 0.1 + 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="https://www.youtube.com/@codewithsanjuu"
                className="border border-purple-600 text-purple-300 hover:text-white hover:bg-purple-700 block px-3 py-2 rounded-full text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Youtube Profile
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar 