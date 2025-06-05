'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '../context/ThemeContext'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import 'aos/dist/aos.css'
import AOS from 'aos'

// Define the interface for the structure of an item from the API response
interface ApiResponseItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags?: string[]; // Making tags optional based on the sample, though it seems to be an array
  category: string; // Assuming category is always a string
  github?: string; // Optional
  webapp?: string; // Optional
  member?: Array<{ // Optional, defining a basic structure
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
  title: string;
  description: string;
  image: string;
  tags: string[];
  details: string;
  type: string;
  github?: string;
  webapp?: string;
  member?: Array<{ // Assuming member structure based on API response
    name: string;
    img?: string;
    linkedin?: string;
    github?: string;
  }>;
}

// Helper function to truncate description
const truncateDescription = (text: string, limit: number) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
};

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
`

const MobileProjectCardContainer = styled(motion.div)`
  flex-shrink: 0;
  width: 280px; /* Adjust card width as needed for mobile */
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
];

const Projects = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const { currentTheme, customBackground } = useTheme()
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [projects, setProjects] = useState<ProjectData[]>([]); // Type the state with the new interface
  const [loading, setLoading] = useState(true); // State to indicate loading
  const [error, setError] = useState<string | null>(null); // State to hold error message

  useEffect(() => {
    AOS.init({ once: true });
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://portfolio-backend-six-ruby.vercel.app/api/projects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponseItem[] = await response.json(); // Type the incoming data as an array of ApiResponseItem
        // Map the API response structure to match the expected project structure
        const formattedProjects: ProjectData[] = data.map((item: ApiResponseItem) => ({
          title: item.title,
          description: item.description,
          image: item.image,
          tags: item.tags || [], // Ensure tags is an array, default to empty if missing
          details: item.description, // Using description for details for now, adjust if API provides separate details
          type: item.category === 'webapp' ? 'web' : (item.category ? item.category.toLowerCase() : 'other'), // Map category to type, handle missing category
          github: item.github,
          webapp: item.webapp,
          member: item.member || []
        }));
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
    ? projects
    : projects.filter(p => p.type === selectedFilter);

  if (loading) {
    return <Container 
      id="projects" 
      $theme={currentTheme}
      $customBackground={customBackground}
     
    >
      <Wrapper>
        <div className="text-center text-white text-lg">Loading projects...</div>
      </Wrapper>
    </Container>;
  }

  if (error) {
    return <Container 
      id="projects" 
      $theme={currentTheme}
      $customBackground={customBackground}
     
    >
      <Wrapper>
        <div className="text-center text-red-500 text-lg">{error}</div>
      </Wrapper>
    </Container>;
  }

  if (filteredProjects.length === 0 && !loading && !error) {
     return <Container 
      id="projects" 
      $theme={currentTheme}
      $customBackground={customBackground}
     
    >
      <Wrapper>
        <div className="text-center text-gray-400 text-lg">No projects found for this filter.</div>
      </Wrapper>
    </Container>;
  }

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

        {isMobile ? (
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
                  data-aos="zoom-in-right"
                  data-aos-duration="3000"
                >
                  <ProjectCard>
                    <div className="relative h-36">
                      <Image
                        src={project.image && project.image.trim() !== '' ? project.image : 'https://via.placeholder.com/400x300.png?text=No+Image'}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3">
                        {truncateDescription(project.description, 200)}
                      </p>
                      <div className="flex flex-wrap gap-1">
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
                data-aos="zoom-in-right"
                data-aos-duration="3000"
              >
                <ProjectCard>
                  <div className="relative h-48">
                    <Image
                      src={project.image && project.image.trim() !== '' ? project.image : 'https://via.placeholder.com/400x300.png?text=No+Image'}
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
                      {truncateDescription(project.description, 200)}
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
        )}

        {/* Modal */}
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
                  onClick={() => setOpenIndex(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden relative">
                  <Image
                    src={filteredProjects[openIndex]?.image && filteredProjects[openIndex]?.image.trim() !== '' ? filteredProjects[openIndex]?.image : 'https://via.placeholder.com/400x300.png?text=No+Image'} // Placeholder if image is missing
                    alt={filteredProjects[openIndex]?.title || 'Project image'}
                    fill
                    className="object-cover"
                  />
                </div>
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
                <p className="text-gray-300 mb-4">{filteredProjects[openIndex]?.details}</p>
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
      </Wrapper>
    </Container>
  )
}

export default Projects 