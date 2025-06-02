'use client'

import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Add a fixed array of random images
const randomImages = [
  'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png',
  'https://www.w3.org/html/logo/badge/html5-badge-h-solo.png',
  'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg',
  'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
  'https://upload.wikimedia.org/wikipedia/commons/4/47/React.svg',
  'https://upload.wikimedia.org/wikipedia/commons/9/96/Sass_Logo_Color.svg',
  'https://cdn-icons-png.flaticon.com/512/919/919836.png',
  'https://cdn-icons-png.flaticon.com/512/5968/5968292.png',
  'https://cdn-icons-png.flaticon.com/512/5968/5968322.png',
  'https://cdn-icons-png.flaticon.com/512/5968/5968350.png',
]

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  padding: 80px 0;
`

const Wrapper = styled.div`
  background: linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%);
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
`

interface SkillCategory {
  title: string
  skills: string[]
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: ['HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'JavaScript', 'React Js', 'Next Js'],
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
  const [viewCount, setViewCount] = useState(0)
  const hasIncrementedRef = useRef(false)
  const skillsRef = useRef<HTMLDivElement>(null)
  const skillCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const skillItemsRef = useRef<(HTMLDivElement | null)[][]>([])

  useEffect(() => {
    AOS.init()
    
    const handlePageView = async () => {
      if (!hasIncrementedRef.current) {
        try {
          const response = await fetch('http://localhost:5000/api/views/skills', {
            method: 'POST'
          })
          const data = await response.json()
          setViewCount(data.count)
          hasIncrementedRef.current = true
        } catch (error) {
          console.error('Error updating views:', error)
        }
      }
    }

    handlePageView()

    document.addEventListener('visibilitychange', () => {
      if (!hasIncrementedRef.current) {
        handlePageView()
      }
    })
    
    return () => {
      document.removeEventListener('visibilitychange', handlePageView)
    }
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
    <Container id="skills" ref={skillsRef}>
      <Wrapper>
        <Title className="skills-title">Skills</Title>
        <small style={{ color: '#858584' }}>Page Views: {viewCount}</small>
        <Desc className="skills-desc">Here are some of my skills on which I have been working on for the past 2 years.</Desc>
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
                  // Pick a random image for each skill item
                  const imgSrc = randomImages[Math.floor(Math.random() * randomImages.length)]
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
                      <img src={imgSrc} alt="icon" style={{ width: 24, height: 24, marginRight: 8, borderRadius: 6, background: '#fff' }} />
                      {item}
                    </SkillItem>
                  )
                })}
              </SkillList>
            </Skill>
          ))}
        </SkillsContainer>
      </Wrapper>
    </Container>
  )
}

export default About 