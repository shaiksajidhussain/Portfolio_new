'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const randomImages = [
 
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
]

const projects = [
  {
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform built with Next.js, Node.js, and MongoDB.',
    image: '/project1.jpg',
    tags: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    details: 'This is a detailed description of the E-commerce Platform project. It includes features, challenges, and more.',
  },
  {
    title: 'Portfolio Website',
    description: 'A modern portfolio website with Three.js animations and interactive elements.',
    image: '/project2.jpg',
    tags: ['React', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
    details: 'This is a detailed description of the Portfolio Website project. It includes features, challenges, and more.',
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates.',
    image: '/project3.jpg',
    tags: ['React', 'Firebase', 'Material-UI', 'Redux'],
    details: 'This is a detailed description of the Task Management App project. It includes features, challenges, and more.',
  },
  {
    title: 'Weather Dashboard',
    description: 'A weather dashboard with live updates and beautiful UI.',
    image: randomImages[3],
    tags: ['React', 'API', 'Styled Components'],
    details: 'This is a detailed description of the Weather Dashboard project. It includes features, challenges, and more.',
  },
  {
    title: 'Blog Platform',
    description: 'A blogging platform with markdown support and user authentication.',
    image: randomImages[4],
    tags: ['Next.js', 'MongoDB', 'Auth'],
    details: 'This is a detailed description of the Blog Platform project. It includes features, challenges, and more.',
  },
  {
    title: 'Finance Tracker',
    description: 'A finance tracker app to manage expenses and income.',
    image: randomImages[5],
    tags: ['React', 'Redux', 'Chart.js'],
    details: 'This is a detailed description of the Finance Tracker project. It includes features, challenges, and more.',
  },
]

const Projects = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      id="projects"
      className="py-20"
      style={{
        background: `linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%)`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Projects
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Here are some of the projects I&apos;ve worked on. Each project is unique and showcases
            different aspects of my skills and expertise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setOpenIndex(index)}
            >
              <div className="relative h-48">
                <Image
                  src={project.image && project.image.trim() !== '' ? project.image : randomImages[Math.floor(Math.random() * randomImages.length)]}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {openIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full relative shadow-2xl border border-indigo-700">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="w-full h-48 mb-4 rounded-lg overflow-hidden relative">
                <Image
                  src={projects[openIndex].image && projects[openIndex].image.trim() !== '' ? projects[openIndex].image : randomImages[Math.floor(Math.random() * randomImages.length)]}
                  alt={projects[openIndex].title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{projects[openIndex].title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {projects[openIndex].tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-indigo-700 text-indigo-100 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 mb-4">{projects[openIndex].details}</p>
              <button
                className="mt-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
                onClick={() => setOpenIndex(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Projects 