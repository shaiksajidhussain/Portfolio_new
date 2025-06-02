'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import TypewriterEffect from './TypewriterEffect'
import FluidSimulation from './FluidSimulation'

const Hero = () => {
  const roles = ['Backend Developer', 'Frontend Developer', 'UI/UX Designer', 'Programmer']

  return (
    <section className="relative h-screen flex items-center justify-center bg-[#191924] text-white overflow-hidden">
      {/* Fluid Simulation Background */}
      <FluidSimulation />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-2/2 text-center md:text-left mb-10 md:mb-0"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-2">
            Hi, I am <br className="block md:hidden"/><span className="text-purple-500">Sajid Hussain</span>
          </h1>
          <div className="text-3xl md:text-4xl text-gray-300 mb-4">
             I am a <span className="text-purple-500"> <TypewriterEffect texts={roles} /></span>
          </div>
           <p className="text-lg text-gray-400 mb-8 max-w-md">
            I am a motivated and versatile individual, always eager to take on new challenges. With a passion for learning I am dedicated to delivering high-quality results. With a positive attitude and a growth mindset, I am ready to make a meaningful contribution and achieve great things.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors"
          >
            Check Resume
          </motion.button>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 flex justify-center md:justify-end"
        >
          <div className="w-96 h-96 rounded-full overflow-hidden border-4 border-purple-600">
            <Image
              src="https://res.cloudinary.com/defsu5bfc/image/upload/v1748891782/Sanju_debxey.jpg"
              alt="Sajid Hussain"
              width={384}
              height={384}
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero