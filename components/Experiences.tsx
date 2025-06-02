'use client'

import React from 'react'
import { motion } from 'framer-motion'

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

const Experiences = () => (
  <section id="experience" className="py-20 bg-[#181824] min-h-screen">
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
                      <span key={i} className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg px-3 py-1 text-sm">
                        {t}
                      </span>
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

export default Experiences
