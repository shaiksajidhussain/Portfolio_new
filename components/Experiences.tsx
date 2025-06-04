'use client'

import React, { useEffect } from 'react'
import styled from 'styled-components'
import 'aos/dist/aos.css'
import AOS from 'aos'
import { useTheme } from '../context/ThemeContext'

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
  }
`

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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
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
    transition: all 0.3s ease;
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
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 0 30px rgba(133, 76, 230, 0.3);
    border-color: rgba(133, 76, 230, 0.3);
    
    &::before {
      transform: translateY(-50%) scale(1.2);
      box-shadow: 0 0 20px rgba(133, 76, 230, 0.7);
    }
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
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(133, 76, 230, 0.2);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(133, 76, 230, 0.2);
    border-color: rgba(94, 223, 255, 0.5);
  }
`

const SectionTitle = styled.h2`
  font-size: 4rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  color: white;
  text-shadow: 0 0 20px rgba(133, 76, 230, 0.3);
  
  &::after {
    content: 'Experience';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 6rem;
    font-weight: 900;
    color: rgba(133, 76, 230, 0.1);
    z-index: -1;
    text-shadow: none;
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
  const { currentTheme, customBackground } = useTheme()

  useEffect(() => {
    AOS.init({ once: true })
  }, [])

  return (
    <Container 
      id="experience" 
      $theme={currentTheme}
      $customBackground={customBackground}
    >
      <Wrapper>
        <SectionTitle>Experience</SectionTitle>
        
        <TimelineContainer>
          {experiences.map((exp, idx) => (
            <ExperienceCard key={idx}>
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
      </Wrapper>
    </Container>
  )
}

export default Experiences
