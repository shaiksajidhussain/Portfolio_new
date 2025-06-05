'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import styled from 'styled-components'

const Container = styled.div<{ $theme: string | null; $customBackground: string | null }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  padding: 80px 0;
  min-height: 100vh;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background: ${props => props.$customBackground ? `url(${props.$customBackground}) center/cover no-repeat` : props.$theme || '#191924'};
`

const Wrapper = styled.div`
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%,30% 98%, 0 100%);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  padding: 40px 0;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`

const ContactCard = styled.div`
  background: rgba(35,35,54,0.6);
  backdrop-filter: blur(12px);   
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid rgba(133,76,230,0.2);
  transition: all 0.3s ease;
  &:hover {
    border-color: rgba(133,76,230,0.4);
    box-shadow: 0 0 20px rgba(133,76,230,0.2);
    transform: translateY(-8px);
  }
`

const Contact = () => {
  const { currentTheme, customBackground } = useTheme()

  return (
    <Container 
      id="contact" 
      $theme={currentTheme}
      $customBackground={customBackground}
    >
      <Wrapper>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let&apos;s Connect
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {/* Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <ContactCard className="h-full">
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-[#854ce6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Get in Touch
              </h3>

              {/* Email */}
              <div className="flex items-center gap-4 p-4 bg-[rgba(133,76,230,0.1)] rounded-xl mb-4 
                            hover:bg-[rgba(133,76,230,0.2)] hover:translate-x-2 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[rgba(133,76,230,0.2)] flex items-center justify-center
                              group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-[#854ce6]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">sanjusazid0@gmail.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 p-4 bg-[rgba(133,76,230,0.1)] rounded-xl mb-4 
                            hover:bg-[rgba(133,76,230,0.2)] hover:translate-x-2 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[rgba(133,76,230,0.2)] flex items-center justify-center
                              group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-[#854ce6]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">+91 7893160318</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 p-4 bg-[rgba(133,76,230,0.1)] rounded-xl mb-8 
                            hover:bg-[rgba(133,76,230,0.2)] hover:translate-x-2 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[rgba(133,76,230,0.2)] flex items-center justify-center
                              group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-[#854ce6]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white"> AndhraPradesh , India</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-3 gap-4">
                {/* GitHub */}
                <motion.a
                  href="https://github.com/shaiksajidhussain"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-4 bg-[rgba(133,76,230,0.1)] rounded-xl 
                           hover:bg-[rgba(133,76,230,0.2)] transition-all duration-300 group relative overflow-hidden"
                >
                  <svg className="w-6 h-6 text-[#854ce6] transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </motion.a>

                {/* LinkedIn */}
                <motion.a
                  href="https://www.linkedin.com/in/shaiksajidhussain/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-4 bg-[rgba(133,76,230,0.1)] rounded-xl 
                           hover:bg-[rgba(133,76,230,0.2)] transition-all duration-300 group relative overflow-hidden"
                >
                  <svg className="w-6 h-6 text-[#854ce6] transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </motion.a>

                {/* Twitter */}
                <motion.a
                  href="https://x.com/Sajidhussain266"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-4 bg-[rgba(133,76,230,0.1)] rounded-xl 
                           hover:bg-[rgba(133,76,230,0.2)] transition-all duration-300 group relative overflow-hidden"
                >
                  <svg className="w-6 h-6 text-[#854ce6] transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </motion.a>
              </div>
            </ContactCard>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <ContactCard>
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-[#854ce6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send a Message
              </h3>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                    <input
                      type="text"
                      placeholder="Test"
                      className="w-full px-4 py-3 bg-[rgba(35,35,54,0.8)] border border-[rgba(133,76,230,0.2)] 
                               rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#854ce6] 
                               focus:ring-2 focus:ring-[rgba(133,76,230,0.2)] transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Your Email</label>
                    <input
                      type="email"
                      placeholder="test@gmail.com"
                      className="w-full px-4 py-3 bg-[rgba(35,35,54,0.8)] border border-[rgba(133,76,230,0.2)] 
                               rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#854ce6] 
                               focus:ring-2 focus:ring-[rgba(133,76,230,0.2)] transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="Project Inquiry"
                    className="w-full px-4 py-3 bg-[rgba(35,35,54,0.8)] border border-[rgba(133,76,230,0.2)] 
                             rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#854ce6] 
                             focus:ring-2 focus:ring-[rgba(133,76,230,0.2)] transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Your Message</label>
                  <textarea
                    placeholder="Tell me about your project..."
                    rows={6}
                    className="w-full px-4 py-3 bg-[rgba(35,35,54,0.8)] border border-[rgba(133,76,230,0.2)] 
                             rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#854ce6] 
                             focus:ring-2 focus:ring-[rgba(133,76,230,0.2)] transition-all duration-300 resize-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#854ce6] to-[#5edfff] text-white font-semibold 
                           rounded-xl hover:shadow-lg hover:shadow-[rgba(133,76,230,0.3)] transition-all duration-300 
                           relative overflow-hidden group flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Send Message</span>
                </motion.button>
              </form>
            </ContactCard>
          </motion.div>
        </div>
      </Wrapper>
    </Container>
  )
}

export default Contact 