# Opened Files
## File Name
components/Projects.tsx
## File Content
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '../context/ThemeContext'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'

// Define the interface for the structure of an item from the API response
interface ApiResponseItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags?: string[];
  category: string;
  order?: number;
  github?: string;
  webapp?: string;
  member?: Array<{
    name: string;
    img?: string;
    linkedin?: string;
    github?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Define the interface for the project data structure used in the component
interface ProjectData {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  details: string;
  type: string;
  order?: number;
  github?: string;
  webapp?: string;
  member?: Array<{
    name: string;
    img?: string;
    linkedin?: string;
    github?: string;
  }>;
}

// Helper function to truncate description
const truncateDescription = (text: string | undefined, limit: number) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
};

// Skeleton Loader Component
const ProjectSkeletonCard = () => (
  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg animate-pulse h-[350px] flex flex-col">
    <div className="w-full h-48 bg-gray-700/50"></div>
    <div className="p-6 flex-1 flex flex-col justify-between">
      <div>
        <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-700/50 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-700/50 rounded w-5/6 mb-4"></div>
      </div>
      <div className="flex flex-wrap gap-2 mt-auto">
        <div className="h-6 bg-gray-700/50 rounded-full w-16"></div>
        <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
        <div className="h-6 bg-gray-700/50 rounded-full w-12"></div>
      </div>
    </div>
  </div>
);

const Container = styled.div<{ $theme: string | null; $customBackground: string | null; $isThemesEnabled: boolean }>`
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
  background: ${props => {
    if (props.$customBackground) {
      return `url(${props.$customBackground}) center/cover no-repeat`;
    }
    if (props.$isThemesEnabled) {
      return props.$theme || '#191924';
    }
    return 'transparent';
  }};
  transition: background 0.3s ease;
  @media (max-width: 960px) {
    flex-direction: column;
  }
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
  @media (max-width: 768px) {
    padding: 40px 1rem;
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
  height: 400px; /* Fixed height for all cards */
  display: flex;
  flex-direction: column;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 12px rgba(133,76,230,0.2);
    border-color: rgba(133,76,230,0.4);
  }
`

const Modal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000000;
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
  /* Adjusted width for larger modal */
  max-width: 600px; /* Example width, adjust as needed */
  max-height: 90vh; /* Limit height and enable scrolling if content overflows */
  overflow-y: auto;
`

const MobileProjectCardContainer = styled(motion.div)`
  flex-shrink: 0;
  width: 280px;
  height: 400px; /* Fixed height for mobile cards */
  scroll-snap-align: start;
`

const MobileProjectsScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  flex-wrap: nowrap;
  gap: 16px; /* Adjust gap as needed */
  padding-bottom: 16px; /* Space for scrollbar */
  /* Hide scrollbar */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
  /* Optional: Add scroll snap for a carousel feel */
  scroll-snap-type: x mandatory;
  width: 100%; /* Ensure it takes full width of parent */
  padding: 0; /* Remove padding here, handle on parent */
`

const FILTERS = [
  { label: "All", value: "all" },
  { label: "WEB APP'S", value: "web" },
  { label: "ANDROID APP'S", value: "android" },
  { label: "Figma", value: "figma" },
  { label: "Chrome Extensions", value: "chrome" },
];

const Projects = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const { currentTheme, customBackground, isThemesEnabled } = useTheme()
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDescription, setExpandedDescription] = useState<boolean>(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://portfolio-backend-six-ruby.vercel.app/api/projects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponseItem[] = await response.json();
        // Map the API response structure to match the expected project structure
        const formattedProjects: ProjectData[] = data.map((item: ApiResponseItem) => ({
          _id: item._id,
          title: item.title,
          description: item.description,
          image: item.image,
          tags: item.tags || [],
          details: item.description,
          type: item.category === 'webapp' ? 'web' : (item.category ? item.category.toLowerCase() : 'other'),
          order: item.order || 0,
          github: item.github,
          webapp: item.webapp,
          member: item.member || []
        }));
        // Sort projects by order
        formattedProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
        setProjects(formattedProjects);
      } catch (err: unknown) {
        console.error("Error fetching projects:", err);
        if (err instanceof Error) {
          setError(`Failed to load projects: ${err.message}`);
        } else {
          setError('Failed to load projects: An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

  }, []);

  // Filter logic
  const filteredProjects = selectedFilter === 'all'
    ? projects.slice(0, 12)
    : projects.filter(p => p.type === selectedFilter).slice(0, 12);

  return (
    <>
      <Container 
        id="projects" 
        $theme={currentTheme}
        $customBackground={customBackground}
        $isThemesEnabled={isThemesEnabled}
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
        {/* Filter Bar - Always visible */}
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

        {/* Conditional Rendering based on Loading, Error, or Projects Found */}
        {loading ? (
            // Render skeleton loaders while loading
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(9)].map((_, index) => (
                    <ProjectSkeletonCard key={index} />
                ))}
            </div>
        ) : error ? (
            <div className="text-center text-red-500 text-lg">{error}</div>
        ) : filteredProjects.length === 0 ? (
            <div className="text-center text-gray-400 text-lg">No projects found for this filter.</div>
        ) : isMobile ? (
          // Mobile horizontal scroll view with styled components
          <div className="w-full">
            <MobileProjectsScrollContainer>
              {filteredProjects.map((project, index) => (
                <MobileProjectCardContainer
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setOpenIndex(index)}
                >
                  <ProjectCard>
                    {/* <div className="relative h-36">
                      <Image
                          src={project.image && project.image.trim() !== '' ? project.image : 'https://via.placeholder.com/400x300.png?text=No+Image'}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        placeholder="empty"
                      />
                    </div> */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3 flex-1">
                          {truncateDescription(project.description, 200)}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-[rgba(133,76,230,0.1)] text-[#854ce6] rounded-full text-xs
                                   hover:bg-[rgba(133,76,230,0.2)] transition-all duration-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </ProjectCard>
                </MobileProjectCardContainer>
              ))}
            </MobileProjectsScrollContainer>
          </div>
        ) : (
          // Desktop grid view
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
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 mb-4 flex-1">
                        {truncateDescription(project.description, 200)}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
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
        )}
        </Wrapper>
      </Container>

      {/* Modal rendered outside the Container */}
      {openIndex !== null && filteredProjects[openIndex] && (
          <Modal>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ModalContent>
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
                  onClick={() => {
                    setOpenIndex(null);
                    setExpandedDescription(false);
                  }}
                  aria-label="Close"
                >
                  &times;
                </button>
                {/* <div className="w-full h-48 mb-4 rounded-lg overflow-hidden relative">
                  <Image
                    src={filteredProjects[openIndex]?.image && filteredProjects[openIndex]?.image.trim() !== '' ? filteredProjects[openIndex]?.image : 'https://via.placeholder.com/400x300.png?text=No+Image'}
                    alt={filteredProjects[openIndex]?.title || 'Project image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="empty"
                  />
                </div> */}
                <h3 className="text-2xl font-bold text-white mb-2">{filteredProjects[openIndex]?.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {filteredProjects[openIndex]?.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[rgba(133,76,230,0.2)] text-[#854ce6] rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-gray-300 mb-4">
                  <p className={expandedDescription ? '' : 'line-clamp-3'}>
                    {filteredProjects[openIndex]?.description}
                  </p>
                  {filteredProjects[openIndex]?.description && filteredProjects[openIndex]?.description.length > 200 && (
                    <button
                      onClick={() => setExpandedDescription(!expandedDescription)}
                      className="text-[#854ce6] hover:text-[#9d6ff7] mt-2 font-medium transition-colors"
                    >
                      {expandedDescription ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>
                {/* You might want to add links to github/webapp here if they exist in the fetched data */}
                {(filteredProjects[openIndex]?.github || filteredProjects[openIndex]?.webapp) && (
                  <div className="flex gap-4 mt-4">
                    {filteredProjects[openIndex]?.github && (
                      <a 
                        href={filteredProjects[openIndex]?.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {filteredProjects[openIndex]?.webapp && (
                      <a
                        href={filteredProjects[openIndex]?.webapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-gradient-to-r from-[#854ce6] to-[#5edfff] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[rgba(133,76,230,0.3)] transition-all duration-300"
                      >
                        View App
                      </a>
                    )}
                  </div>
                )}
                <button
                className="mt-6 px-6 py-2 bg-gradient-to-r from-[#854ce6] to-[#5edfff] text-white rounded-lg 
                           font-semibold hover:shadow-lg hover:shadow-[rgba(133,76,230,0.3)] transition-all duration-300"
                  onClick={() => setOpenIndex(null)}
                >
                  Close
                </button>
              </ModalContent>
            </motion.div>
          </Modal>
        )}
    </>
  )
}

export default Projects 
# Opened Files
## File Name
components/Experiences.tsx
## File Content
'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import 'aos/dist/aos.css'
import AOS from 'aos'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

const TimelineContainer = styled.div`
  position: relative;
  padding: 2rem 0;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    height: 100%;
    background: linear-gradient(to bottom, 
      #854CE6 0%,
      #5edfff 50%,
      #854CE6 100%
    );
    box-shadow: 0 0 20px rgba(133, 76, 230, 0.5);

    @media (max-width: 768px) {
      left: 1rem;
    }
  }
`

const Container = styled.div<{ $theme: string | null; $customBackground: string | null; $isThemesEnabled: boolean }>`
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
  background: ${props => {
    if (props.$customBackground) {
      return `url(${props.$customBackground}) center/cover no-repeat`;
    }
    if (props.$isThemesEnabled) {
      return props.$theme || '#191924';
    }
    return 'transparent';
  }};
  transition: background 0.3s ease;
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

const ExperienceCard = styled.div`
  position: relative;
  width: 45%;
  margin: 4rem 0;
  padding: 2.5rem;
  background: rgba(20, 20, 20, 0.95);
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(133, 76, 230, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(133, 76, 230, 0.1);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  
  &::before {
    content: '';
    position: absolute;
    width: 25px;
    height: 25px;
    background: #854CE6;
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 0 0 15px rgba(133, 76, 230, 0.5);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    will-change: transform;
  }

  &:nth-child(odd) {
    margin-left: auto;
    &::before {
      left: -70px;
    }
  }

  &:nth-child(even) {
    margin-right: auto;
    &::before {
      right: -70px;
    }
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 0 30px rgba(133, 76, 230, 0.3);
    border-color: rgba(133, 76, 230, 0.3);
    
    &::before {
      transform: translateY(-50%) scale(1.2);
      box-shadow: 0 0 20px rgba(133, 76, 230, 0.7);
    }
  }

  @media (max-width: 768px) {
    width: 85%;
    margin: 2rem 0 2rem 3rem;
    padding: 1.5rem;

    &:nth-child(odd),
    &:nth-child(even) {
      margin-left: 3rem;
      margin-right: 0;

      &::before {
        left: -2.5rem;
        right: auto;
      }
    }
  }
`

const MobileExperienceCard = styled(motion.div)<{ $isExpanded: boolean }>`
  display: none;
  background: rgba(20, 20, 20, 0.95);
  border-radius: 20px;
  padding: 1.2rem;
  margin: 1rem 0;
  border: 1px solid rgba(133, 76, 230, 0.1);
  box-shadow: 0 0 20px rgba(133, 76, 230, 0.2);
  backdrop-filter: blur(10px);
  width: 260px;
  flex-shrink: 0;
  scroll-snap-align: start;
  min-height: 400px;
  max-height: ${props => props.$isExpanded ? '800px' : '400px'};
  display: flex;
  flex-direction: column;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: max-height;

  @media (max-width: 768px) {
    display: flex;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 30px rgba(133, 76, 230, 0.3);
    border-color: rgba(133, 76, 230, 0.3);
  }
`

const MobileExperienceScrollContainer = styled.div`
  display: none;
  overflow-x: auto;
  flex-wrap: nowrap;
  gap: 16px;
  padding: 0 1rem 16px 1rem;
  width: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`

const MobileCompanyName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #854CE6;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 0 10px rgba(133, 76, 230, 0.3);
`

const MobileRole = styled.p`
  font-size: 1rem;
  color: #5edfff;
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-shadow: 0 0 10px rgba(94, 223, 255, 0.3);
`

const MobilePeriod = styled.div`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: linear-gradient(45deg, #854CE6, #5edfff);
  color: white;
  font-weight: 600;
  border-radius: 25px;
  margin-bottom: 0.8rem;
  font-size: 0.8rem;
  box-shadow: 0 0 15px rgba(133, 76, 230, 0.2);
`

const MobileDescription = styled.div<{ $isExpanded: boolean }>`
  color: #e0e0e0;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  flex: 1;
  overflow: hidden;
  display: ${props => props.$isExpanded ? 'block' : '-webkit-box'};
  -webkit-line-clamp: ${props => props.$isExpanded ? 'unset' : '6'};
  -webkit-box-orient: vertical;
  transition: opacity 0.3s ease;
  will-change: opacity;
`

const ReadMoreButton = styled.button`
  color: #854CE6;
  font-weight: 600;
  font-size: 0.8rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0;
  width: 100%;
  text-align: center;
  transition: color 0.2s ease;
  
  &:hover {
    color: #5edfff;
  }

  &:active {
    transform: scale(0.98);
  }
`

const MobileTechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
`

const MobileTechTag = styled.span`
  background: rgba(133, 76, 230, 0.1);
  color: #5edfff;
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(94, 223, 255, 0.3);
  border-radius: 25px;
  transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(133, 76, 230, 0.2);
    transform: translateY(-2px);
    border-color: rgba(94, 223, 255, 0.5);
  }
`

const CompanyName = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #854CE6;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 0 0 10px rgba(133, 76, 230, 0.3);

  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(to right, #854CE6, transparent);
  }
`

const Role = styled.p`
  font-size: 1.3rem;
  color: #5edfff;
  margin-bottom: 1rem;
  font-weight: 500;
  text-shadow: 0 0 10px rgba(94, 223, 255, 0.3);
`

const Period = styled.div`
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(45deg, #854CE6, #5edfff);
  color: white;
  font-weight: 600;
  border-radius: 25px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  box-shadow: 0 0 15px rgba(133, 76, 230, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(133, 76, 230, 0.3);
  }
`

const Description = styled.p`
  color: #e0e0e0;
  line-height: 1.8;
  margin-bottom: 1.8rem;
  font-size: 1.05rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const TechTag = styled.span`
  background: rgba(133, 76, 230, 0.1);
  color: #5edfff;
  padding: 0.5rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 500;
  border: 1px solid rgba(94, 223, 255, 0.3);
  border-radius: 25px;
  transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(133, 76, 230, 0.2);
    transform: translateY(-3px);
    border-color: rgba(94, 223, 255, 0.5);
  }
`

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  color: white;
  text-shadow: 0 0 20px rgba(133, 76, 230, 0.3);
  
  
`

const experiences = [
  {
    company: 'Melody Mocktails',
    role: 'MERN STACK Developer',
    period: 'June 2024 – Dec 2024',
    description: `During a 4-month engagement as resource persons for Melody Mocktails, we demonstrated exceptional multitasking abilities by concurrently managing responsibilities across multiple companies. In this period, we successfully delivered three significant projects, showcasing our versatility and efficiency in handling diverse client needs. Our role involved leveraging the MERN stack to develop robust, scalable solutions tailored to each clients unique requirements. We utilized React.js for creating dynamic front-end interfaces, while employing Express.js and MongoDB to build powerful, data-driven back-ends. Our expertise in modern design tools like Figma, coupled with proficiency in CSS frameworks such as Tailwind and Bootstrap, enabled us to create visually appealing and highly functional web applications. This experience not only honed our technical skills but also enhanced our project management and client communication abilities, solidifying our reputation as adaptable and results-driven developers in the industry..`,
    tech: [
      'Next JS', 'JavaScript', 'React', 'Rest API', 'HTML', 'CSS', 'JavaScript', 'Express Js', 'MongoDB', 'Mongoose', 'Jira', 'BitBucket', 'VS Code'
    ]
  },
  {
    company: 'QubicGen',
    role: 'MERN STACK Developer',
    period: 'Feb 2023 - On Going',
    description: `As a MERN stack developer at QubicGen, I spearheaded the creation of our company website. Leveraging React.js for the frontend and Express.js with MongoDB for the backend, I crafted a dynamic and engaging platform. Utilizing tools like Figma for design and frameworks such as Tailwind CSS and Bootstrap, I ensured a sleek and modern user experience. Additionally, I integrated various libraries like AOS to enhance the websites functionality and aesthetics. Working collaboratively within the team, we delivered a cutting-edge website that embodies QubicGens vision and professionalism.`,
    tech: [
      'JavaScript', 'React', 'Rest API', 'HTML', 'CSS', 'JavaScript', 'Express Js', 'MongoDB', 'Mongoose'
    ]
  },
  {
    company: 'Marolix Technology Solutions Pvt Ltd',
    role: 'Java FullStack Developer',
    period: 'Marolix Technology Solutions Pvt Ltd',
    description: `As a Java and front-end developer at Marolix, I crafted Tidy Tangle—a user-friendly app for seamless home services. I designed intuitive interfaces, connecting electricians and plumbers to the Spring backend via REST APIs. Collaborating with the agile backend team, we delivered a robust, scalable platform for flawless home services.`,
    tech: [
      'Java', 'Spring Boot', 'Rest API', 'HTML', 'CSS', 'JavaScript', 'Angular'
    ]
  },
  {
    company: 'SRIC',
    role: 'Frontend Developer Intern',
    period: 'SRIC',
    description: `I designed and developed SRICs public website, implementing a user-friendly interface with HTML, CSS, and JavaScript. I integrated a secure database for collecting and storing user information while optimizing performance and responsiveness across various device`,
    tech: [
      'ReactJS', 'Material UI', 'HTML', 'CSS', 'JavaScript', 'Codegniter'
    ]
  },
  {
    company: 'Skilync',
    role: 'Web Designer Intern',
    period: 'Skilync',
    description: `As an web Designer Intern at Skylync from June 2022 to Aug 2022, I gained valuable hands-on experience in web designing..`,
    tech: [
      'Flutter Flow', 'Cloud Firestore', 'Firebase', 'Figma'
    ]
  },
]

const Experiences = () => {
  const { currentTheme, customBackground, isThemesEnabled } = useTheme()
  const [expandedCards, setExpandedCards] = useState<{ [key: number]: boolean }>({})

  const toggleExpand = (index: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  useEffect(() => {
    AOS.init({ once: true })
  }, [])

  return (
    <Container 
      id="experience" 
      $theme={currentTheme}
      $customBackground={customBackground}
      $isThemesEnabled={isThemesEnabled}
    >
      <Wrapper>
        <SectionTitle>Experience</SectionTitle>
        
        {/* Desktop Timeline View */}
        <TimelineContainer className="hidden md:block" data-aos="zoom-in" data-aos-duration="3000">
          {experiences.map((exp, idx) => (
            <ExperienceCard key={idx} >
              <CompanyName>{exp.company}</CompanyName>
              <Role>{exp.role}</Role>
              <Period>{exp.period}</Period>
              <Description>{exp.description}</Description>
              <TechStack>
                {exp.tech.map((t, i) => (
                  <TechTag key={i}>{t}</TechTag>
                ))}
              </TechStack>
            </ExperienceCard>
          ))}
        </TimelineContainer>

        {/* Mobile Horizontal Scroll View */}
        <MobileExperienceScrollContainer>
          {experiences.map((exp, idx) => (
            <MobileExperienceCard 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              $isExpanded={expandedCards[idx] || false}
            >
              <MobileCompanyName>{exp.company}</MobileCompanyName>
              <MobileRole>{exp.role}</MobileRole>
              <MobilePeriod>{exp.period}</MobilePeriod>
              <MobileDescription $isExpanded={expandedCards[idx] || false}>
                {exp.description}
              </MobileDescription>
              <ReadMoreButton onClick={() => toggleExpand(idx)}>
                {expandedCards[idx] ? '▲ Show Less' : '▼ Read More'}
              </ReadMoreButton>
              <MobileTechStack>
                {exp.tech.map((t, i) => (
                  <MobileTechTag key={i}>{t}</MobileTechTag>
                ))}
              </MobileTechStack>
            </MobileExperienceCard>
          ))}
        </MobileExperienceScrollContainer>
      </Wrapper>
    </Container>
  )
}

export default Experiences

# Opened Files
## File Name
components/SkillsSphere.tsx
## File Content
'use client'
import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'

// Type extensions for navigator and WebGL renderer
declare global {
  interface Navigator {
    deviceMemory?: number;
  }
  
  interface WebGLRenderer {
    antialias?: boolean;
    alpha?: boolean;
  }
}

interface SkillItem {
  name: string
  icon: string
  category: string
  position: [number, number, number]
}

interface SkillsSphereProps {
  skills: Array<{
    title: string
    skills: string[]
  }>
  skillImages: Record<string, string>
  onSkillHover?: (skill: string) => void
  onSkillClick?: (skill: string) => void
  isLowPerformance?: boolean
}

// Individual skill point component
function SkillPoint({ skill, position, onClick }: {
  skill: SkillItem
  position: [number, number, number]
  onClick: (skill: string) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const floatIntensity = 0.03
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * floatIntensity
    }
  })

  const handleClick = () => {
    onClick(skill.name)
  }

  return (
    <group position={position}>
      {/* Invisible larger sphere for click detection */}
      <mesh
        onClick={handleClick}
      >
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Visible skill sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial
          color='#ffffff'
          emissive='#854ce6'
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Skill label - always visible */}
      <Html
        position={[0, 0.2, 0]}
        center
        distanceFactor={6}
        occlude={false}
        style={{
          pointerEvents: 'none',
          fontSize: '14px',
          color: '#ffffff',
          fontWeight: 'bold',
          textShadow: '2px 2px 6px rgba(0,0,0,0.9)',
          opacity: 0.9,
        }}
      >
        <div style={{ 
          background: 'rgba(0,0,0,0.8)', 
          padding: '6px 12px', 
          borderRadius: '15px',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(4px)'
        }}>
          {skill.name}
        </div>
      </Html>
    </group>
  )
}

// Main sphere component
function SkillsSphere({ skills, skillImages, onSkillClick, isLowPerformance = false }: SkillsSphereProps) {
  const sphereRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Generate skill positions on sphere surface
  const skillItems = useMemo(() => {
    const items: SkillItem[] = []
    let index = 0

    skills.forEach((category) => {
      category.skills.forEach((skill) => {
        // Fibonacci spiral distribution on sphere
        const phi = Math.acos(1 - 2 * index / (skills.flatMap(s => s.skills).length))
        const theta = Math.PI * (3 - Math.sqrt(5)) * index

        const x = Math.cos(theta) * Math.sin(phi)
        const y = Math.cos(phi)
        const z = Math.sin(theta) * Math.sin(phi)

        items.push({
          name: skill,
          icon: skillImages[skill] || '',
          category: category.title,
          position: [x * 2.5, y * 2.5, z * 2.5] as [number, number, number]
        })
        index++
      })
    })

    return items
  }, [skills, skillImages])

  useFrame(() => {
    if (groupRef.current) {
      // Continuous auto rotation - slower and smoother
      groupRef.current.rotation.y += 0.003
    }
  })

  const handleSkillClick = (skill: string) => {
    console.log(`Clicked on skill: ${skill}`)
    onSkillClick?.(skill)
  }

  return (
    <group ref={groupRef}>
      {/* Main sphere wireframe */}
      <Sphere args={isLowPerformance ? [2.5, 16, 16] : [2.5, 32, 32]}>
        <meshBasicMaterial
          color="#854ce6"
          wireframe
          opacity={0.15}
          transparent
        />
      </Sphere>

      {/* Skill points - limit on low performance devices */}
      <group ref={sphereRef}>
        {(isLowPerformance ? skillItems.slice(0, 15) : skillItems).map((skill, index) => (
          <SkillPoint
            key={`${skill.category}-${skill.name}-${index}`}
            skill={skill}
            position={skill.position}
            onClick={handleSkillClick}
          />
        ))}
      </group>

      {/* Optimized lighting based on performance */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#854ce6" />
      {!isLowPerformance && (
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#5edfff" />
      )}
    </group>
  )
}

// Main component
const SkillsSphereComponent: React.FC<SkillsSphereProps> = (props) => {
  const [mounted, setMounted] = useState(false)
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Detect low performance devices
    const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                     (navigator.deviceMemory || 8) <= 4 ||
                     /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    setIsLowPerformance(isLowEnd)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Loading 3D Skills...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        performance={{ min: 0.5 }} // Enable performance monitoring
        dpr={isLowPerformance ? [1, 1.5] : [1, 2]} // Limit pixel ratio on low-end devices
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0, 0)
          
          // Optimize renderer settings
          gl.setPixelRatio(Math.min(window.devicePixelRatio, isLowPerformance ? 1.5 : 2))
        }}
        gl={{ 
          antialias: !isLowPerformance,
          alpha: true,
          powerPreference: isLowPerformance ? "low-power" : "high-performance"
        }}
      >
        <SkillsSphere {...props} isLowPerformance={isLowPerformance} />
      </Canvas>
      
  
      
      {/* Performance indicator */}
      {isLowPerformance && (
        <div className="absolute top-4 right-4 text-xs text-yellow-400 opacity-75">
          Optimized for performance
        </div>
      )}
    </div>
  )
}

export default SkillsSphereComponent

# Opened Files
## File Name
components/About.tsx
## File Content
'use client'

import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useTheme } from '../context/ThemeContext'
import Image from 'next/image'
import SkillsSphereComponent from './SkillsSphere'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Map each skill to a suitable image/logo
const skillImages: Record<string, string> = {
  'HTML': 'https://www.w3.org/html/logo/badge/html5-badge-h-solo.png',
  'CSS': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1452px-CSS3_logo_and_wordmark.svg.png',
  'Tailwind CSS': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png',
  'Bootstrap': 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
  'JavaScript': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/800px-JavaScript-logo.png',
  'React Js': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',
  'Next Js': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO0AAADVCAMAAACMuod9AAAAeFBMVEUAAAD///+Dg4PY2NgvLy9RUVErKyuIiIj8/PyysrLh4eGOjo5ra2s3Nzf5+flFRUVlZWVycnKmpqadnZ3p6ekUFBR6enoZGRnLy8s+Pj4sLCzx8fEmJiZMTEzPz88ICAjExMSwsLBcXFy7u7ugoKCWlpYeHh5YWFgRguI2AAAEjElEQVR4nO3ZaUPiOhiG4VARFKSyL4Isg47//x+eLkla2qwcp3y5ry8zlBDzdHmbpkIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgdwzGw9LA2Ww1TDw2suU0WeeStbmjWWn9XH7c+Lr1jCvSc096cjbr93wmzQ6/Tf3M1be70H6f/0na3tXVbBCcVrypLdN2N2v13Y/c0E8flLY3/J20+vilH81edqrxWG15XFq9w/9nWrGVm5aNTjZ7+UV1Gj0wbbqxNotKK1Sq820nT3LzqNrUf3lY2vowzGmXT1b9WuuJyrCo93Ex7NTBTR9yL9U3jd7/WVp7pZJpXZd2nalS6Qr1x/qzcn+8hI49nkyrDsbY0mzg/rpl0TrB39UWxx577SjtWF1qlkoVm7ZVqVbtCtXWVdpE7fr0YGwWnVYsZYfH8qOqUM5JTFdphyKRwzFXqvi0E3XmFpXqonbmX9dvuksr/1TrtlGKT1tVqpkQQ/V/xy1ddJpWn2ymSHekrSrVR0iFynWZVhcSwwT3nrTiLPtbqo5fPT/oMq34lIN6aVequ9LqSiW5H7NEx2kdlUqmfZ2+tRlOBel2XpiefIPpNq24yIGdm81c8+S9vfe3ejv/jLfjtLpSNR/FXWmbjzp131WzxD+YrtPaKtW9aXWl6l0CBtN12mo6e1up7k4rRrLVMWAwnafVjyq3Ge68bvNfqko19w+m+7TiIke3rTeTafcjA89Rm6q9YlmFrPGmnaobwGQ4/0rMU3qXdlpxlKOrV6rI51s1uOIE0ZVq52vvTSu/nMghXr33tAZDWl2p3qptd80uDmnvnP+rKtV+5fmBN21aXDaDfDErza8Q+2KLmSFttTRYLRrelTYvUAv1n5xvMhWYNjuy2+ws/lxGT+5MaQ2V6p60V32CHAIrVWDa7NAWn3YBk9FbxrR6SVhXqjvSqss1X0b7o84W9xQjLO1GpRWnU+SFa06rK5VaNIxPqwMWpXisPjkrVeCxzc7grXNVwMqSVj++zMqP0Wk/GifvVX7c29esg9MW97TRZerqysyWVleqcp04Om1rChVSqQLTZne2omEaMGG5ZUsrZnJ0y+LSiE2rbzp6y0odbMcjfWja7DqZj/L+9r9z3YpGpYqcXegJRW2lP6BShafNh5TsPS8m2+xpdaXKz5e490D1BbiKXoqzPugGpE2zSrySs5RVL/8Yw5H2VKtUUWltt1ddqWxzKmvaz8UinyCfimObpKmc1Dpf1EWmrV6c7+LSNhbOK75KZUp7+JoWV0H+m3VxXf2oV8Nj39NmVFpdqfbiEJFWvRRpPwlu1NtaS6UypR3lr8myg9o7Jou0XGV4ytqcvxf5Oov/uSo8rfhSR2kVnlYvIxsmEj/qO/PfM6TNd9Cwemycqz1Q/xhO/n3brUVVKr3gYqWy6ReXM1N/ulIZFyrlhX2zLVme839211G63KqnsvVxmaaja/Sb7NPgkBlYn8X6pUnfR9353iXLFHGimL78W3YVmwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgMf5D+CTNGY7cUYoAAAAAElFTkSuQmCC',
  'Three Js' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAACiCAMAAAD84hF6AAAAjVBMVEUAAAD///8kJCT8/Pz5+fmNjY1nZ2fe3t709PTT09M8PDz39/e+vr5wcHDx8fHt7e2VlZXJycmdnZ3k5ORHR0fS0tK3t7empqZiYmJ9fX3a2trGxsa7u7utra2jo6NXV1dCQkIeHh4rKysLCwt5eXmHh4c1NTWRkZFPT08VFRUpKSl0dHQ3NzdTU1M/Pz+g8SvHAAAM6ElEQVR4nO1dZ4OiSBClbBQUARFFxBxwdHTu//+860jobifszhqw34c7F5Vh3xQVX7FWy+APYBkYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGPwdlsG8c+9reELEAGCPh5d7X8eTIcGsYeYgnnTMoOv72IO92feJzYE7zv+79+U8C3oIRpa1Ow4zwhxyEv/eV/QccGDAXmzPiUuNbpYf7ntJz4AFOOUfjpOMerpgsjrd75KeAVOwawy9n2cBZS56G93rmp4APYCVdOi0Go4Jc+AsU2N0VxDCm+bopk+Jw55u+n7zS3oGLCDSHE2JjwtjZnQL2R4NLB+CjeYgOBOIrcO0H1Kjm09NTlfDBiCVj50RxJsRQI/8wefhNVua8FpBCEPpyBTbWsvaBJDzA4dpRMNrGBlPJ9CXnRtmLSP3bReS8iAOr9TTIWx0N728R0UOYe3mawN06YsBhPVPbnOW06H5fnuzy3tUtACqie0AYMxefQCoXZF0wYzOWY52t7m+R0UsylKCJcCMv9yFMNV8vINYSgfxPH/lPt1cmBfGpGTNsiLoq59OPbAB5ROHGl138LIlWA6ueLmAahgYys4No4Ot7GTDGVevb2OamLh9/yVv11Hh3BKAReWNFFBP+uyZ5iZjQW66oNkwGg+Pt7jSh8IuhjZ9IbFmWdSqqmAZHXaAZbfp2GY5XZycXyy89pk/w9X7pP7GuHrLWuR2ZnylYFdbmS0/oeHVy95eyeimgPB/Z6CUC4NqD9Oy3kRugp2bPCbs5V0aXsP5/t9d6GNhjeCIw6baQTrWUrpBGWUj6W5mSBlzMG6/RngNYaljzbJQJXMbQpmPDCDWnGZFhhEBq16TFxggRuRvmmveyEqrwhndvDieAqg1fYd26KJdJ6HhNRgPGu7pchIJlfaRRUJmxl/VM7qtC8pk0EcQt3IILDJAHESskFg0OafrcZ+UyynEUVhVAvWgminOjWV0OAcUJsY7nJqzNgYhZA5i5tGptkNOAdDAOJdzk2U9xpa5iVe92deDmJ01aeYsh2Ruh+mcZl/BLC8D4Zg6NDU3wc6tdvdh1rqUmVnFAxJczok4a/M6nG3Wc9utJl1iHiiepIyVJQmZkZrRbbgZFt+HMbOnXI2xu9WSnnUmv/H0WAMSLqm1n9Eby43aG2pVFs7G2so3aq1fnNGJDvGh3r0rEKrUNwBurbU2YkoaiCd7BDgZ07TdqiKIYdWSQg3HWoNtAuZya+3Q5oHwSkbngyd81bJ2/+madLuGskYGCkqCtTtOHKYZnPtqIESiLF1ALQpoCojdWE/982Okd0nvwuJUJY3I3ORu0xpAEnrtMu1t3gTsQp09MNYmgzENEmFNvsUzNyWjUyYQu7ixrOld0igEe5VRWvYzyqA9fhOmlIJ9oRndUvpWv36mbQxIanY2CG11bvARgP2BwyQPmR+DDDEljU+aGxvAzg27+oH8tTYtSwV6mLUGS/hHSk/j6EGAk7lVpZPbm7KU353la8uBxUzDGv5CxbldMGu6HkFjEEvO7QNBsCYvUL3ZMVo6LKcLr+QmrUoBcQlV1WGzIElBcHkQM6PpSgMF7OT9ecACrLZeKicQIxu8hjd664qPDoKYj9wXcrODYsXlltHbh5zwFW5yZUPY8E4lcUmlNIEI3ESXrAOuRnF/IPcoopL8sO/XGuAfAFRDmGLWmi8mdEuXNMWslSmaRjdorUMIxuDs0gW9Xb3xsjSrHRPGdTBrL7DhUGZuROBWufO68vgUR1kX3HWHzgmtdZuJGoKksxFfmDPVwwuwVrok0nKs+iulk2utPBJlD3YRJc9z1sbtvpG7cojLUtIjb2wzvAoxBhhCRYFEgO2mTkDqMaeVVdsao3bX43W/D97SBkdVUjcSiLqkoZJWHKQZPGYtpq5+IpnhwWeaQaaQbvDIqgaaoC1BLU6dWt3pF65+D0ixqPWQjea7/+46HwxE8bEAJbklmVtW/gHHC5HgXXQx1qIr0WPd8WZiDWgmS7UoyEBBQMjIKWJNSao32CaDpGByG4hg6xbODUfZcZnbLnRWNdEZbJNB9voGa80bjrDBt2KwR+GDqwhk5Pl987EELhaSg6BwbpXBHsUJFJ2boshsPnBZGrGlvqiuUNuDR2xMzU1i+aae62/zRmMTYOMZDTNaoMf9TuH63xEJmRPV1c8l56ZRZL4AuEhy6zMBeDmucjAbE5DkHRaJq2E1c9N2e5uPQTkGOPK0NaSbaROyXqpx9ZtSl2WRfFm7Cd14pPXqkz9tAHXzNvm/ztVnpSvbOU0dIn+FlisvIohxFVxJYRdFFbV1AH1vHJpqZvzPDVUkScdV4rkqa+VNHmMpa6ouVQv/14PtwInu29kbahXgVsYNDoUTaQ4luk2tGNA3n/PT/u06/3LFgdwOK0Dq740oXyKwp3Oue8urlQErSw8h2N8dh/46bVtQ1nduDVeVa5y6xNUj0slNh8zTZcOVyDsSUjeMQnC/GIeeikTl12mz2lFy5/a7vGWF/75MLyR6bpc84jndng66zoCsYwjeF4O9bVic9/dpuz/khq31jl09mWglZT1w+mA7uHa2SEnrt41tbf35aQ9BGYibSFsqDUXfRYCclru6BJdpHzEBOPkfUz1cxyWoVBhNpK0USVIcYtHAPSBFN5gu2C7Dl+PQ/8hsJlwkSULOzWj7b4IPoomILruZg52jn4nqbDUnA4molkXuSWPLS9bK+dNswXs2lyV92GY0uPUSf1R1bhe31As5uiL9sMd2FH+xlDbyhAiYpjdEjM97VPhvyLOWN8LljNqvxbS+/AtFpFnF4lhfXnDwRP+qjYqfdOM+zLDi3EYBBMVl1wYKBc721+PQCXIRET64nkfyBExbTAiKHZJF28wuBuSRNiQz9AYsdkM4m5N0UeQ1K2J92ZyqEzNp8GNz2nxKe5aF12qaf4e0zNxGLhW4cUwrA4Xqwa/HobvWjvac+L8q2GZapQ/L2gxB9AcG9GCyeidnS/DLNrntiIWxFssOW1SYiq9LnRhBG/bDMdl9Ol3awxuvZbYKORv+/QYVF4HrgQ/5w/L8/iqqu6iUNl7z43vVpn9BQptQXeKfJErjjc0LAHyCkFv1Gb+9rp2d07b1wL6bVCfjGTfRC9Ucq/p8POyQou8NkWXahEjnHfgvg9AmvGhSab2nwJT/MZRNhr7cwuK09VBN/npb8BXSFEFcf5pFIj9CSp4sfAKJttJLAs9vBlD61LjaFAioaR1xUVe0TbALQ7Wzc9re8Y08udfO9Ir6MN9W9EL7euZGur3fZU2mrczbgLulCm0tHClyXyCkH9hj2jriEDbyupsVvi2iieRUfnbJTfAe4N81kQXKv7dDfQa/+Em0+glt2zJfYchp6KmjdnGCtg3PUeLFHZSvGSRn0AlPa8/H+9k49Ce0Hew6Q/ZIRN8S9auzi7njUmzt3H5UuwCkL39mlXHf/Gctrp/Q9o5v0s6lJ/AfSUCwtQXlod66fna7Mq5dLdng7ea8kaTR1Vl5XipT+z9Mw39CG1k2kncrcUBF1+sluz7l3p5xnmzf2sO1iG+xM/VpFOXz8X48Dv0JbcSzyxs5J/ezn2gr4oDwihbqXyIDm3plry/NY4TASLcy9Dmq8/wvaeuA6gES0IwqhO1rabv5xhLR6qYT5ly7y8raAeu5bSLdEvjnGFZY+ZI2KuGJqGGf0llMfxZ55AZiFdM27zrkzd0YbNaK5rSdZhl7+P5pcYebFDs3m9Qxxzbb6guTM3crOQQna/MnO7XEgLLhotvffIe2ER3PZlFEH3HGjtNYao+jiD6tgBg7SUrYwIjT1ql+69sp5a9hU1j4psNW02yHejpcLK6Jw/6DIbLDE4MVbxwJaGmzeuLjhBleiOVueaxLWkfnglJO22Zc+cQdRrFx1f0ecnY1cX+K3yA0/smTxk4JpZ+cd+RVZthLiGmHoyfNfqacAmdf+Ij3IfMbaM6bWTNcOdAXhW8bLRi34V3UAUs5beswBThJ6MD7U1+7Xf1sT2G7+lC+sF4dNb2DWkjore61HJeCp1zwaDimHsd9wJ1aNZLeBSek1SWccA3tPeJ26IPQhh24bsq9DsFVOpWPAO9BaEt0CvCjDcFD7tQSDchDLJb74CoTArJodZdO1ueYRTMcPVVffA+0kLLh3nEfcjt0z/KUB5G+duUGh4+KEchDYTMObM95FOmrLAXxvx4i3wunzeMsYJ7r3fpvD/ZeHL2acyOLVoa178CpeNm3l9pz/CuUCnDSK7t9F+ZJ4YPNX6mLVgZXsRX78bqVIYOr4Lt72iVwg6tgu3s/HIcaTInSR/33Ogy+AED6onuOfwXaBn+UYu95QJWg976I58P0VbdD/xKDh2g0GxgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGDQP/wOBV7PfqSrWwAAAAABJRU5ErkJggg==",
  'Express Js': 'data:image/jpeg;base64,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',
  'Python': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
  'Java': 'https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg',
  'MySQL': 'https://cdn-icons-png.flaticon.com/512/5968/5968313.png',
  'MongoDB': 'https://cdn.iconscout.com/icon/free/png-256/mongodb-5-1175140.png',
  'Firebase': 'https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg',
  'Figma': 'https://cdn.iconscout.com/icon/free/png-256/figma-3521426-2944870.png',
  'React Native': 'https://reactnative.dev/img/header_logo.svg',
  'Git': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9jy1nCmfook6BbyrZIEN0azpKlTag2eO4sA&usqp=CAU',
  'GitHub': 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',

  'VS Code': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/512px-Visual_Studio_Code_1.35_icon.svg.png?20210804221519',
  'Jira': 'data:image/jpeg;base64,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',


}

const Container = styled.div<{ $theme: string | null; $customBackground: string | null; $isThemesEnabled: boolean }>`
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
  background: ${props => {
    if (props.$customBackground) {
      return `url(${props.$customBackground}) center/cover no-repeat`;
    }
    if (props.$isThemesEnabled) {
      return props.$theme || '#191924';
    }
    return 'transparent';
  }};
  transition: background 0.3s ease;
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

export const Title = styled.div`
  font-size: 42px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: #F2F3F4;
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`

export const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: #B1B2B3;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const SkillsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  gap: 30px;
  justify-content: center;
`

const Skill = styled.div`
  width: 100%;
  max-width: 500px;
  background: #1C1C27;
  border: 0.1px solid #854CE6;
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  border-radius: 16px;
  padding: 18px 36px;
  @media (max-width: 768px) {
    max-width: 400px;
    padding: 10px 36px;
  }
  @media (max-width: 500px) {
    max-width: 330px;
    padding: 10px 36px;
  }
`

const SkillTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #B1B2B3;
  margin-bottom: 20px;
  text-align: center;
`

const SkillList = styled.div`
  display: flex;
  justify-content: center; 
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`

// Add keyframes for rotation
const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const SkillItem = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #F2F3F4;
  border: 1px solid #F2F3F4;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 12px;
  }
  @media (max-width: 500px) {
    font-size: 14px;
    padding: 6px 12px;
  }

  // Animate the image inside on hover
  &:hover img {
    animation: ${rotate360} 0.7s linear;
  }

  // Glowing effect on hover
  &:hover {
    box-shadow: 0 0 16px 4px #854ce6, 0 0 32px 8px #5edfff44;
    border-color: #854ce6;
  }
`

interface SkillCategory {
  title: string
  skills: string[]
}

const ToggleButton = styled.button`
  background: linear-gradient(135deg, #854ce6, #5edfff);
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin: 2rem 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(133, 76, 230, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(133, 76, 230, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`

const SphereContainer = styled.div`
  width: 100%;
  max-width: 900px;
  height: 600px;
  margin: 2rem auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  position: relative;
  border: 1px solid rgba(133, 76, 230, 0.2);

  @media (max-width: 768px) {
    height: 500px;
    max-width: 95%;
  }

  @media (max-width: 480px) {
    height: 400px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(133, 76, 230, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(94, 223, 255, 0.15) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }

  /* Canvas should be above the background */
  canvas {
    position: relative;
    z-index: 2;
  }
`

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: ['HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'JavaScript', 'React Js', 'Next Js' , 'Three Js'],
  },
  {
    title: 'Backend',
    skills: ['Express Js', 'Python', 'Java', 'MySQL', 'MongoDB', 'Firebase'],
  },
  {
    title: 'UI/UX',
    skills: ['Figma'],
  },
  {
    title: 'App Development',
    skills: ['React Native'],
  },
  {
    title: 'Others',
    skills: ['Git', 'GitHub', 'Netlify', 'VS Code', 'Jira'],
  },
]

const About = () => {
  const { currentTheme, customBackground, isThemesEnabled } = useTheme()
  const skillsRef = useRef<HTMLDivElement>(null)
  const skillCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const skillItemsRef = useRef<(HTMLDivElement | null)[][]>([])
  const [show3DSphere, setShow3DSphere] = useState(false)

  useEffect(() => {
    AOS.init()
  }, [])

  useEffect(() => {
    const skillsSection = skillsRef.current
    if (!skillsSection) return

    const skillCards = skillCardsRef.current
    const skillItems = skillItemsRef.current

    const titleElement = skillsSection.querySelector('.skills-title')
    const descElement = skillsSection.querySelector('.skills-desc')

    if (titleElement) {
      gsap.fromTo(titleElement, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, scrollTrigger: {
          trigger: skillsSection,
          start: 'top 80%',
        }}
      )
    }

    if (descElement) {
      gsap.fromTo(descElement,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, scrollTrigger: {
          trigger: skillsSection,
          start: 'top 80%',
        }}
      )
    }

    skillCards.forEach((card, index) => {
      if (!card) return

      gsap.fromTo(card,
        { opacity: 0, y: 50, rotationX: -10 },
        { opacity: 1, y: 0, rotationX: 0, duration: 0.8, delay: 0.1 * index, scrollTrigger: {
          trigger: card,
          start: 'top 90%',
        }}
      )

      const skillItems = card.querySelectorAll('.skill-item')
      gsap.fromTo(skillItems,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.2 + 0.1 * index, scrollTrigger: {
          trigger: card,
          start: 'top 90%',
        }}
      )
    })

    // Hover animations for skill items
    skillItems.forEach((itemGroup) => {
      if (!itemGroup) return
      
      itemGroup.forEach((item) => {
        if (!item) return

        item.addEventListener('mouseenter', () => {
          gsap.to(item, {
            scale: 1.1,
            boxShadow: '0 0 15px rgba(133, 76, 230, 0.5)',
            duration: 0.3
          })
        })

        item.addEventListener('mouseleave', () => {
          gsap.to(item, {
            scale: 1,
            boxShadow: 'none',
            duration: 0.3
          })
        })
      })
    })

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <Container 
      id="skills" 
      ref={skillsRef}
      $theme={currentTheme}
      $customBackground={customBackground}
      $isThemesEnabled={isThemesEnabled}
    >
      <Wrapper>
        <Title className="skills-title">Skills</Title>
        <Desc className="skills-desc">Here are some of my skills on which I have been working on for the past 2 years.</Desc>
        
        <ToggleButton onClick={() => setShow3DSphere(!show3DSphere)}>
          {show3DSphere ? '📋 Show Traditional View' : '🌐 Show 3D Interactive Sphere'}
        </ToggleButton>

        {show3DSphere ? (
          <SphereContainer>
            <SkillsSphereComponent
              skills={skillCategories}
              skillImages={skillImages}
              onSkillClick={(skill) => {
                console.log(`Clicked on skill: ${skill}`)
                // You can add more interactive behavior here
              }}
            />
          </SphereContainer>
        ) : (
          <SkillsContainer>
            {skillCategories.map((skill, index) => (
              <Skill 
                key={index} 
                ref={(el) => {
                  skillCardsRef.current[index] = el
                }}
              >
                <SkillTitle>{skill.title}</SkillTitle>
                <SkillList>
                  {skill.skills.map((item, itemIndex) => {
                    // Use the mapped image for each skill, fallback to a default if not found
                    const imgSrc = skillImages[item] || 'https://cdn-icons-png.flaticon.com/512/565/565547.png'
                    return (
                      <SkillItem 
                        key={itemIndex} 
                        className="skill-item"
                        ref={(el) => {
                          if (!skillItemsRef.current[index]) {
                            skillItemsRef.current[index] = []
                          }
                          skillItemsRef.current[index][itemIndex] = el
                        }}
                      >
                        <Image 
                          src={imgSrc} 
                          alt={`${item} icon`}
                          width={24}
                          height={24}
                          style={{ marginRight: 8, borderRadius: 6, background: '#fff', objectFit: 'contain' }}
                        />
                        {item}
                      </SkillItem>
                    )
                  })}
                </SkillList>
              </Skill>
            ))}
          </SkillsContainer>
        )}
      </Wrapper>
    </Container>
  )
}

export default About 
