'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import styled, { keyframes } from 'styled-components'
import 'aos/dist/aos.css'
import AOS from 'aos'

const glowPulse = keyframes`
  0% {
    box-shadow: 0 0 8px 2px #854ce6, 0 0 0px 0px #5edfff44;
  }
  50% {
    box-shadow: 0 0 24px 8px #854ce6, 0 0 32px 8px #5edfff44;
  }
  100% {
    box-shadow: 0 0 8px 2px #854ce6, 0 0 0px 0px #5edfff44;
  }
`

const TechTag = styled.span`
  background: linear-gradient(90deg, #854ce6 0%, #5edfff 100%);
  color: #fff;
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 0 8px 2px #854ce6;
  transition: transform 0.2s, box-shadow 0.2s, border 0.2s;
  border: 1.5px solid transparent;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:hover, &:focus {
    animation: ${glowPulse} 1.2s infinite;
    border: 1.5px solid #5edfff;
    transform: scale(1.08) rotate(-2deg);
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 0.5rem;
    pointer-events: none;
    z-index: -1;
    transition: box-shadow 0.2s;
  }
`

const experiences = [
  {
    company: 'Melody Mocktails',
    role: 'MERN STACK Developer',
    period: 'Jan 2023 – Apr 2023',
    description: `Delivered 3 projects using React, Express, MongoDB, Tailwind. Built dynamic UIs and admin dashboards.`,
    tech: [
      'Next JS', 'JavaScript', 'React', 'Rest API', 'HTML', 'CSS', 'JavaScript', 'Express Js', 'MongoDB', 'Mongoose', 'Jira', 'BitBucket', 'VS Code'
    ]
  },
  {
    company: 'QubicGen',
    role: 'MERN STACK Developer',
    period: 'QubicGen',
    description: `Developed company website using React, Tailwind. Integrated animations and dynamic content.`,
    tech: [
      'JavaScript', 'React', 'Rest API', 'HTML', 'CSS', 'JavaScript', 'Express Js', 'MongoDB', 'Mongoose'
    ]
  },
  {
    company: 'Marolix Technology Solutions Pvt Ltd',
    role: 'Java FullStack Developer',
    period: 'Marolix Technology Solutions Pvt Ltd',
    description: `Built Tidy Tangle app using Spring Boot + Angular.`,
    tech: [
      'Java', 'Spring Boot', 'Rest API', 'HTML', 'CSS', 'JavaScript', 'Angular'
    ]
  },
  {
    company: 'SRIC',
    role: 'Frontend Developer Intern',
    period: 'SRIC',
    description: `Built public site with HTML, CSS, JavaScript.`,
    tech: [
      'ReactJS', 'Material UI', 'HTML', 'CSS', 'JavaScript', 'Codegniter'
    ]
  },
  {
    company: 'Skilync',
    role: 'Web Designer Intern',
    period: 'Skilync',
    description: `Created designs in Figma, used Flutter Flow and Firebase.`,
    tech: [
      'Flutter Flow', 'Cloud Firestore', 'Firebase', 'Figma'
    ]
  },
]

const Experiences = () => {
  useEffect(() => {
    AOS.init({ once: true })
  }, [])

  return (
    <section
      id="experience"
      className="py-20 min-h-screen"
      style={{
        background: `linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%)`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white mb-2 text-center"
        >
          Experience
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-400 text-lg text-center max-w-3xl mx-auto mb-10"
        >
          My work experience as a software engineer and working on different companies and projects.
        </motion.p>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#854CE6]"></div>
          <div className="space-y-10">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative"
                data-aos="flip-left"
                data-aos-delay={idx * 100}
              >
                <div className="flex items-center">
                  <div className="w-1/2 pr-10 text-right">
                    <h3 className="text-2xl font-semibold text-[#854CE6]">{exp.company}</h3>
                    <p className="text-xl font-medium text-white">{exp.role}</p>
                    <p className="text-gray-400 text-sm">{exp.period}</p>
                  </div>
                  <div className="w-1/2 pl-10">
                    <p className="text-gray-400 text-base mb-2">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((t, i) => (
                        <TechTag key={i}>{t}</TechTag>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experiences
