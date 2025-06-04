'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '../context/ThemeContext'
import styled from 'styled-components'

const Container = styled.div<{ $theme: string; $customBackground: string | null }>`
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
  background: ${props => props.$customBackground ? `url(${props.$customBackground}) center/cover no-repeat` : props.$theme};
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

const ProjectCard = styled.div`
  background: rgba(35,35,54,0.6);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(133,76,230,0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 12px rgba(133,76,230,0.2);
    border-color: rgba(133,76,230,0.4);
  }
`

const Modal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
`

const ModalContent = styled.div`
  background: rgba(35,35,54,0.95);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 32rem;
  width: 100%;
  position: relative;
  box-shadow: 0 0 20px rgba(133,76,230,0.2);
  border: 1px solid rgba(133,76,230,0.4);
`

const randomImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
]

const FILTERS = [
  { label: "All", value: "all" },
  { label: "WEB APP'S", value: "web" },
  { label: "ANDROID APP'S", value: "android" },
  { label: "Figma", value: "figma" },
];

const projects = [
  {
    title: 'Milk Diary',
    description: 'Milk Diary Management System | Arokya & Hatsun | Under Qubicgen, we developed an... ',
    image: '/project1.jpg',
    tags: ['React Js', 'Express Js', 'Postgres', 'Prisma', 'Devops', 'Vercel'],
    details: '...',
    type: 'web',
  },
  {
    title: 'Frames',
    description: 'Split my video into frames (thanks to Sheryians for showing how!) Built a webpage that loads these...',
    image: '/project2.jpg',
    tags: ['HTML5', 'Tailwind Css', 'Javascript'],
    details: '...',
    type: 'web',
  },
  {
    title: 'Imagifine',
    description: 'Imagine A cutting-edge SaaS application that harnesses the power of AI to transform text...',
    image: '/project3.jpg',
    tags: ['Next Js', 'Razorpay', 'Gemini', 'MongoDB', 'Jira', 'BitBucket', 'Tailwind CSS', 'Figma'],
    details: '...',
    type: 'figma',
  },
  {
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform built with Next.js, Node.js, and MongoDB.',
    image: '/project1.jpg',
    tags: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    details: 'This is a detailed description of the E-commerce Platform project. It includes features, challenges, and more.',
    type: 'web',
  },
  {
    title: 'Portfolio Website',
    description: 'A modern portfolio website with Three.js animations and interactive elements.',
    image: '/project2.jpg',
    tags: ['React', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
    details: 'This is a detailed description of the Portfolio Website project. It includes features, challenges, and more.',
    type: 'web',
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates.',
    image: '/project3.jpg',
    tags: ['React', 'Firebase', 'Material-UI', 'Redux'],
    details: 'This is a detailed description of the Task Management App project. It includes features, challenges, and more.',
    type: 'web',
  },
  {
    title: 'Weather Dashboard',
    description: 'A weather dashboard with live updates and beautiful UI.',
    image: randomImages[0],
    tags: ['React', 'API', 'Styled Components'],
    details: 'This is a detailed description of the Weather Dashboard project. It includes features, challenges, and more.',
    type: 'web',
  },
  {
    title: 'Blog Platform',
    description: 'A blogging platform with markdown support and user authentication.',
    image: randomImages[1],
    tags: ['Next.js', 'MongoDB', 'Auth'],
    details: 'This is a detailed description of the Blog Platform project. It includes features, challenges, and more.',
    type: 'web',
  },
  {
    title: 'Finance Tracker',
    description: 'A finance tracker app to manage expenses and income.',
    image: randomImages[2],
    tags: ['React', 'Redux', 'Chart.js'],
    details: 'This is a detailed description of the Finance Tracker project. It includes features, challenges, and more.',
    type: 'web',
  },
]

const Projects = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const { currentTheme, customBackground } = useTheme()

  // Filter logic
  const filteredProjects = selectedFilter === 'all'
    ? projects
    : projects.filter(p => p.type === selectedFilter)

  return (
    <Container 
      id="projects" 
      $theme={currentTheme}
      $customBackground={customBackground}
    >
      <Wrapper>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Projects
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            I have worked on a wide range of projects. From web apps to android apps. Here are some of my projects.
          </p>
        </motion.div>
        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setSelectedFilter(f.value)}
              className={`px-6 py-2 rounded-lg border border-[#854ce6] text-sm font-semibold transition-all duration-200
                ${selectedFilter === f.value ? 'bg-[#854ce6] text-white' : 'bg-transparent text-[#854ce6] hover:bg-[#854ce6]/20'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setOpenIndex(index)}
            >
              <ProjectCard>
                <div className="relative h-48">
                  <Image
                    src={project.image && project.image.trim() !== '' ? project.image : randomImages[Math.floor(Math.random() * randomImages.length)]}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[rgba(133,76,230,0.1)] text-[#854ce6] rounded-full text-sm
                                 hover:bg-[rgba(133,76,230,0.2)] transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </ProjectCard>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {openIndex !== null && (
          <Modal>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ModalContent>
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
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
                      className="px-3 py-1 bg-[rgba(133,76,230,0.2)] text-[#854ce6] rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4">{projects[openIndex].details}</p>
                <button
                  className="mt-2 px-6 py-2 bg-gradient-to-r from-[#854ce6] to-[#5edfff] text-white rounded-lg 
                           font-semibold hover:shadow-lg hover:shadow-[rgba(133,76,230,0.3)] transition-all duration-300"
                  onClick={() => setOpenIndex(null)}
                >
                  Close
                </button>
              </ModalContent>
            </motion.div>
          </Modal>
        )}
      </Wrapper>
    </Container>
  )
}

export default Projects 