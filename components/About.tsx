'use client'

import React, { useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useTheme } from '../context/ThemeContext'
import Image from 'next/image'

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
  'Three Js' : "data:image/png;base64,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",
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
      </Wrapper>
    </Container>
  )
}

export default About 