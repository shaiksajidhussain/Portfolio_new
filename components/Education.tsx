'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { education } from '../data/educationData'
import Image from 'next/image'
import styled, { keyframes } from 'styled-components'
import 'aos/dist/aos.css'
import AOS from 'aos'
import { useTheme } from '../context/ThemeContext'

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

const glow = keyframes`
  0% {
    box-shadow: 0 0 0px 0px #854ce6, 0 0 0px 0px #5edfff33;
  }
  50% {
    box-shadow: 0 0 8px 2px #854ce6, 0 0 16px 4px #5edfff33;
  }
  100% {
    box-shadow: 0 0 0px 0px #854ce6, 0 0 0px 0px #5edfff33;
  }
`

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`

const GlowingDot = styled.span`
  background: linear-gradient(90deg, #854ce6 0%, #5edfff 100%);
  border-radius: 9999px;
  width: 1rem;
  height: 1rem;
  display: block;
  border: 4px solid #181824;
  z-index: 10;
  box-shadow: 0 0 4px 1px #854ce6;
  animation: ${glow} 1.5s infinite, ${float} 2.5s ease-in-out infinite;
`

const GlowingCard = styled.div`
  background: #232336;
  border-radius: 0.75rem;
  box-shadow: 0 0 4px 1px #854ce633;
  border: 1px solid #854ce644;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: box-shadow 0.3s, border 0.3s, transform 0.3s;
  &:hover {
    box-shadow: 0 0 12px 4px #854ce6, 0 0 24px 8px #5edfff33;
    border: 1.5px solid #5edfff;
    transform: scale(1.025) translateY(-4px);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.75rem;

    .flex-shrink-0 {
      width: 3.5rem;
      height: 3.5rem;
      img {
        width: 100%;
        height: 100%;
      }
    }

    h3 {
      font-size: 1rem;
    }

    .text-primary {
      font-size: 0.8rem;
    }

    .text-xs {
      font-size: 0.7rem;
    }

    .text-gray-300 {
      font-size: 0.8rem;
    }
  }
`

const Education = () => {
  const { currentTheme, customBackground } = useTheme()

  useEffect(() => {
    AOS.init({ once: true })
  }, [])

  return (
    <Container 
      id="education" 
      $theme={currentTheme}
      $customBackground={customBackground}
    >
      <Wrapper>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-primary mb-2">Education</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            My education has been a journey of self-discovery and growth. My educational details are as follows.
          </p>
        </motion.div>
        <div className="relative">
          {/* Timeline vertical line */}
          <div className="hidden md:block absolute left-6 top-0 h-full w-1 bg-primary/30 rounded-full" />
          <div className="space-y-8">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex items-start md:pl-16 mx-2"
                data-aos="flip-right"
                data-aos-delay={index * 100}
              >
                {/* Timeline dot */}
                <GlowingDot className="absolute left-2 md:left-4 top-6" />
                {/* Card */}
                <GlowingCard className="flex-1">
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 border-primary bg-white flex items-center justify-center">
                    <Image
                      src={edu.image}
                      alt={edu.institution}
                      width={56}
                      height={56}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 flex items-center gap-2">
                      {edu.institution}
                    </h3>
                    <div className="text-primary text-sm font-medium mb-1">{edu.degree}</div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-1">
                      <span><span className="font-semibold text-primary">{edu.duration}</span></span>
                      <span><span className="font-semibold text-primary">Grade:</span> {edu.grade}</span>
                    </div>
                    <div className="text-gray-300 text-xs md:text-sm leading-relaxed">
                      {edu.description}
                    </div>
                  </div>
                </GlowingCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Wrapper>
    </Container>
  )
}

export default Education
