'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { education } from '../data/educationData'
import Image from 'next/image'
import styled, { keyframes } from 'styled-components'
import 'aos/dist/aos.css'
import AOS from 'aos'

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
`

const Education = () => {
  useEffect(() => {
    AOS.init({ once: true })
  }, [])

  return (
    <section
      id="education"
      className="py-20 min-h-screen"
      style={{
        background: `linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%)`
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="relative flex items-start md:pl-16"
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
      </div>
    </section>
  )
}

export default Education
