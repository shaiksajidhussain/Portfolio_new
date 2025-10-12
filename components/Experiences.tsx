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
