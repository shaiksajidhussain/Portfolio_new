'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import TypewriterEffect from './TypewriterEffect'
import FluidSimulation from './FluidSimulation'
import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react';

// const API_URL = 'http://localhost:5000'; // Removed as we're using the Vercel URL
const API_URL = 'https://portfolio-backend-six-ruby.vercel.app';

const GradientName = styled.span`
  background: linear-gradient(90deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: 700;
`

const Hero = () => {
  const roles = ['Backend Developer', 'Frontend Developer', 'UI/UX Designer', 'Programmer']
  const [windowWidth, setWindowWidth] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [viewCount, setViewCount] = useState(0); // State for view count
  const hasIncrementedRef = useRef(false); // Ref to prevent multiple increments on mount
  const [loadingViews, setLoadingViews] = useState(true); // State for loading views
  const [viewError, setViewError] = useState<string | null>(null); // State for view error
  const [profilePic, setProfilePic] = useState<string>('https://res.cloudinary.com/defsu5bfc/image/upload/v1748891782/Sanju_debxey.jpg');

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    // Fetch profile picture from carousel API
    const fetchProfilePic = async () => {
      try {
        const response = await fetch(`${API_URL}/api/carausel`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.length > 0 && data[0].profilePic) {
          setProfilePic(data[0].profilePic);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePic();

    // --- View Count Logic ---
    const fetchViewCount = async () => {
      try {
        const response = await fetch(`${API_URL}/api/views/hero`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setViewCount(data.count);
      } catch (error: unknown) {
        console.error('Error fetching view count:', error);
         if (error instanceof Error) {
          setViewError(`Failed to load views: ${error.message}`);
        } else {
          setViewError('Failed to load views: An unknown error occurred.');
        }
      } finally {
        setLoadingViews(false);
      }
    };

    const incrementViewCount = async () => {
      if (!hasIncrementedRef.current) {
        try {
          const response = await fetch(`${API_URL}/api/views/hero`, {
            method: 'POST'
          });
           if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setViewCount(data.count);
          hasIncrementedRef.current = true;
        } catch (error: unknown) {
          console.error('Error incrementing view count:', error);
           if (error instanceof Error) {
            setViewError(`Failed to increment views: ${error.message}`);
          } else {
            setViewError('Failed to increment views: An unknown error occurred.');
          }
        }
      }
    };

    fetchViewCount();
    incrementViewCount(); // Increment on initial load

    // Optional: Increment view count when the tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        incrementViewCount();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    // --- End View Count Logic ---

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (!mounted) {
    return (
      <section className="relative min-h-screen bg-[#191924] text-white overflow-hidden flex flex-col items-center md:justify-center">
         {/* Server-side render fallback structure to prevent hydration errors */}
         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center md:flex-row md:justify-between pt-32 pb-16 md:py-16 md:items-center">
             {/* Basic structure mirroring both client layouts to prevent mismatch */}
             <div className="md:w-2/2 text-center md:text-left mb-10 md:mb-0 py-8"></div>
             <div className="md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0"></div>
         </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-[#191924] text-white overflow-hidden flex flex-col items-center md:justify-center">
      {/* Fluid Simulation Background */}
      {windowWidth >= 512 && <FluidSimulation />}

      {/* Mobile background SVG */}
      {windowWidth < 512 && (
        <div className="absolute inset-0 z-0 ">
          <svg className="BgAnimation__svg w-full h-full" viewBox="0 0 602 602" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.15"><path fillRule="evenodd" clipRule="evenodd" d="M201.337 87.437C193.474 79.5738 180.725 79.5738 172.862 87.437L87.437 172.862C79.5739 180.725 79.5739 193.474 87.437 201.337L400.663 514.563C408.526 522.426 421.275 522.426 429.138 514.563L514.563 429.138C522.426 421.275 522.426 408.526 514.563 400.663L201.337 87.437ZM30.4869 115.912C-8.82897 155.228 -8.82897 218.972 30.4869 258.287L343.713 571.513C383.028 610.829 446.772 610.829 486.088 571.513L571.513 486.088C610.829 446.772 610.829 383.028 571.513 343.713L258.287 30.4869C218.972 -8.82896 155.228 -8.82896 115.912 30.4869L30.4869 115.912Z" stroke="url(#paint0_radial)" id="path_0"></path><path d="M514.563 201.337C522.426 193.474 522.426 180.725 514.563 172.862L429.138 87.437C421.275 79.5738 408.526 79.5739 400.663 87.437L358.098 130.002L301.148 73.0516L343.713 30.4869C383.028 -8.82896 446.772 -8.82896 486.088 30.4869L571.513 115.912C610.829 155.228 610.829 218.972 571.513 258.287L357.802 471.999L300.852 415.049L514.563 201.337Z" stroke="url(#paint1_radial)" id="path_1"></path><path d="M243.901 471.999L201.337 514.563C193.474 522.426 180.725 522.426 172.862 514.563L87.437 429.138C79.5739 421.275 79.5739 408.526 87.437 400.663L301.148 186.952L244.198 130.002L30.4869 343.713C-8.82897 383.028 -8.82897 446.772 30.4869 486.088L115.912 571.513C155.228 610.829 218.972 610.829 258.287 571.513L300.852 528.949L243.901 471.999Z" stroke="url(#paint2_radial)" id="path_2"></path></g><ellipse cx="295.027" cy="193.118" transform="translate(-295.027 -193.118)" rx="1.07306" ry="1.07433" fill="#945DD6"><animateMotion dur="10s" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_2"></mpath></animateMotion></ellipse><path d="M294.685 193.474L268.932 219.258" transform="translate(-294.685 -193.474) rotate(45 294.685 193.474)" stroke="url(#paint3_linear)"><animateMotion dur="10s" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_2"></mpath></animateMotion></path><ellipse cx="295.027" cy="193.118" transform="translate(-295.027 -193.118)" rx="1.07306" ry="1.07433" fill="#46737"><animateMotion dur="5s" begin="1" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_2"></mpath></animateMotion></ellipse><path d="M294.685 193.474L268.932 219.258" transform="translate(-294.685 -193.474) rotate(45 294.685 193.474)" stroke="url(#paint7_linear)"><animateMotion dur="5s" begin="1" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_2"></mpath></animateMotion></path><ellipse cx="476.525" cy="363.313" rx="1.07433" ry="1.07306" transform="translate(-476.525 -363.313) rotate(90 476.525 363.313)" fill="#945DD6"><animateMotion dur="10s" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_0"></mpath></animateMotion></ellipse><path d="M476.171 362.952L450.417 337.168" transform="translate(-476.525 -363.313) rotate(-45 476.171 362.952)" stroke="url(#paint4_linear)"><animateMotion dur="10s" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_0"></mpath></animateMotion></path><ellipse cx="382.164" cy="155.029" rx="1.07433" ry="1.07306" transform="translate(-382.164 -155.029) rotate(90 382.164 155.029)" fill="#F46737"><animateMotion dur="10s" begin="1" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_0"></mpath></animateMotion></ellipse><path d="M381.81 154.669L356.057 128.885" transform="translate(-381.81 -154.669) rotate(-45 381.81 154.669)" stroke="url(#paint5_linear)"><animateMotion dur="10s" begin="1" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_0"></mpath></animateMotion></path><ellipse cx="333.324" cy="382.691" rx="1.07306" ry="1.07433" transform="translate(-333.324 -382.691) rotate(-180 333.324 382.691)" fill="#F46737"><animateMotion dur="5s" begin="0" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_1"></mpath></animateMotion></ellipse><path d="M333.667 382.335L359.42 356.551" transform="scale(-1 1) translate(-333.667 -382.335) rotate(45 333.667 382.335)" stroke="url(#paint6_linear)"><animateMotion dur="5s" begin="0" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_1"></mpath></animateMotion></path><ellipse cx="165.524" cy="93.9596" rx="1.07306" ry="1.07433" transform="translate(-165.524 -93.9596)" fill="#F46737"><animateMotion dur="10s" begin="3" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_0"></mpath></animateMotion></ellipse><path d="M165.182 94.3159L139.429 120.1" transform="translate(-165.182 -94.3159) rotate(45 165.182 94.3159)" stroke="url(#paint7_linear)"><animateMotion dur="10s" begin="3" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_0"></mpath></animateMotion></path><ellipse cx="476.525" cy="363.313" rx="1.07433" ry="1.07306" transform="translate(-476.525 -363.313) rotate(90 476.525 363.313)" fill="#13ADC7"><animateMotion dur="12s" begin="4" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_0"></mpath></animateMotion></ellipse><path d="M476.171 362.952L450.417 337.168" transform="translate(-476.525 -363.313) rotate(-45 476.171 362.952)" stroke="url(#paint11_linear)"><animateMotion dur="12s" begin="4" repeatCount="indefinite" rotate="auto"><mpath xlinkHref="#path_0"></mpath></animateMotion></path><defs><radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(301 301) rotate(90) scale(300)"><stop offset="0.333333" stopColor="#FBFBFB"></stop><stop offset="1" stopColor="white" stopOpacity="0"></stop></radialGradient><radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(301 301) rotate(90) scale(300)"><stop offset="0.333333" stopColor="#FBFBFB"></stop><stop offset="1" stopColor="white" stopOpacity="0"></stop></radialGradient><radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(301 301) rotate(90) scale(300)"><stop offset="0.333333" stopColor="#FBFBFB"></stop><stop offset="1" stopColor="white" stopOpacity="0"></stop></radialGradient><linearGradient id="paint3_linear" x1="295.043" y1="193.116" x2="269.975" y2="218.154" gradientUnits="userSpaceOnUse"><stop stopColor="#945DD6"></stop><stop offset="1" stopColor="#945DD6" stopOpacity="0"></stop></linearGradient><linearGradient id="paint4_linear" x1="476.529" y1="363.31" x2="451.461" y2="338.272" gradientUnits="userSpaceOnUse"><stop stopColor="#945DD6"></stop><stop offset="1" stopColor="#945DD6" stopOpacity="0"></stop></linearGradient><linearGradient id="paint5_linear" x1="382.168" y1="155.027" x2="357.1" y2="129.989" gradientUnits="userSpaceOnUse"><stop stopColor="#F46737"></stop><stop offset="1" stopColor="#F46737" stopOpacity="0"></stop></linearGradient><linearGradient id="paint6_linear" x1="333.309" y1="382.693" x2="358.376" y2="357.655" gradientUnits="userSpaceOnUse"><stop stopColor="#F46737"></stop><stop offset="1" stopColor="#F46737" stopOpacity="0"></stop></linearGradient><linearGradient id="paint7_linear" x1="165.54" y1="93.9578" x2="140.472" y2="118.996" gradientUnits="userSpaceOnUse"><stop stopColor="#F46737"></stop><stop offset="1" stopColor="#F46737" stopOpacity="0"></stop></linearGradient><linearGradient id="paint8_linear" x1="414.367" y1="301.156" x2="439.435" y2="276.118" gradientUnits="userSpaceOnUse"><stop stopColor="#13ADC7"></stop><stop offset="1" stopColor="#13ADC7" stopOpacity="0"></stop></linearGradient><linearGradient id="paint9_linear" x1="515.943" y1="288.238" x2="541.339" y2="291.454" gradientUnits="userSpaceOnUse"><stop stopColor="#13ADC7"></stop><stop offset="1" stopColor="#13ADC7" stopOpacity="0"></stop></linearGradient><linearGradient id="paint10_linear" x1="117.001" y1="230.619" x2="117.36" y2="258.193" gradientUnits="userSpaceOnUse"><stop stopColor="#945DD6"></stop><stop offset="1" stopColor="#945DD6" stopOpacity="0"></stop></linearGradient><linearGradient id="paint11_linear" x1="476.529" y1="363.31" x2="451.461" y2="338.272" gradientUnits="userSpaceOnUse"><stop stopColor="#13ADC7"></stop><stop offset="1" stopColor="#13ADC7" stopOpacity="0"></stop></linearGradient></defs></svg>
        </div>
      )}

      {/* Content */}
      {windowWidth >= 512 ? (
        // Large screen layout (>= 512px)
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center md:flex-row md:justify-between pt-32 pb-16 md:py-16 md:items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-2/2 text-center md:text-left mb-10 md:mb-0 py-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-2">
              Hi, I am <br className="block md:hidden"/><GradientName>Sajid Hussain</GradientName>
            </h1>
            {/* Display view count */} 
            {!loadingViews && viewError && <p className="text-sm text-red-500 mt-1 mb-4">{viewError}</p>}
            {!loadingViews && !viewError && viewCount > 0 && (
              <p className="text-sm text-gray-400 mt-1 mb-4">Page Views: {viewCount}</p>
            )}
            <div className="text-3xl md:text-4xl text-gray-300 mb-4">
               I am a <span className="text-purple-500"> <TypewriterEffect texts={roles} /></span>
            </div>
             <p className="text-lg text-gray-400 mb-8 max-w-md">
              I am a motivated and versatile individual, always eager to take on new challenges. With a passion for learning I am dedicated to delivering high-quality results. With a positive attitude and a growth mindset, I am ready to make a meaningful contribution and achieve great things.
            </p>
            <a href="https://drive.google.com/file/d/15YTmp-7BY14fMqJqai8izWkw43e11w7b/view?usp=sharing" target='_blank' rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors"
            >
              Check Resume
            </motion.button>
            </a>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0"
          >
            <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-purple-600 md:w-96 md:h-96 md:mx-0">
              <Image
                src={profilePic}
                alt="Sajid Hussain"
                width={384}
                height={384}
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      ) : (
        // Small screen layout (< 512px)
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center pt-32 pb-16">
           {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-purple-600 mb-8"
          >
            <Image
              src={profilePic}
              alt="Sajid Hussain"
              width={400}
              height={400}
              className="object-cover w-full h-full"
            />
          </motion.div>
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-2">
              Hi, I am
            </h1>
            <h2 className="text-6xl font-bold mb-2">
              <GradientName>Sajid Hussain</GradientName>
            </h2>
            {/* Display view count for small screens */} 
            {!loadingViews && viewError && <p className="text-sm text-red-500 mt-1 mb-4">{viewError}</p>}
            {!loadingViews && !viewError && viewCount > 0 && (
              <p className="text-sm text-gray-400 mt-1 mb-4">Page Views: {viewCount}</p>
            )}
            <div className="text-3xl text-gray-300 mb-4">
               I am a <span className="text-purple-500"> <TypewriterEffect texts={roles} /></span>
            </div>
             <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
              I am a motivated and versatile individual, always eager to take on new challenges. With a passion for learning I am dedicated to delivering high-quality results. With a positive attitude and a growth mindset, I am ready to make a meaningful contribution and achieve great things.
            </p>
            <a href="https://drive.google.com/file/d/1PDYOJQFdpIK-cECppfRe4GbF6aJwZ2mX/view" target='_blank' rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors"
            >
              Check Resume
            </motion.button>
              </a>
          </motion.div>
        </div>
      )}
    </section>
  )
}

export default Hero