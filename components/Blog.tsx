'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import Image from 'next/image'
import { useMediaQuery } from 'react-responsive'
import Link from 'next/link'
import config from './config'

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

const BlogCard = styled(motion.div)`
  background: rgba(35,35,54,0.6);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(133,76,230,0.2);
  transition: all 0.3s ease;
  width: 100%;
  max-width: 350px;
  height: 450px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(133,76,230,0.4);
    box-shadow: 0 8px 20px rgba(133,76,230,0.2);
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`

const Content = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Title = styled.h3`
  color: #854CE6;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.4;
`

const Excerpt = styled.p`
  color: #e0e0e0;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 1rem 0;
  flex: 1;
`

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(133,76,230,0.2);
`

const StyledDate = styled.span`
  color: #5edfff;
  font-size: 0.9rem;
`

const ReadMore = styled(Link)`
  color: #854CE6;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: #5edfff;
  }
`

const LoadingSpinner = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid #854CE6;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 3rem;
  color: white;
  text-shadow: 0 0 20px rgba(133, 76, 230, 0.3);
`

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  padding: 0 1rem;
`

const MobileBlogScrollContainer = styled.div`
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

const MobileBlogCard = styled(motion.div)`
  flex-shrink: 0;
  width: 280px;
  scroll-snap-align: start;
`

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  readTime: string;
  date: string;
  views: number;
  status: 'draft' | 'published';
}

export default function Blog() {
  const { currentTheme, customBackground, isThemesEnabled } = useTheme()
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingPostId, setLoadingPostId] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${config.CURRENT_URL}/api/blog`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setBlogPosts(data)
      } catch (err) {
        console.error('Error fetching blog posts:', err)
        setError('Failed to load blog posts.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlogPosts()
  }, [])

  const handleReadMore = (postId: string) => {
    setLoadingPostId(postId)
  }

  const renderBlogCard = (post: BlogPost, index: number) => (
    <BlogCard
      key={post._id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={() => handleReadMore(post._id)}
    >
      <ImageContainer>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
      </ImageContainer>
      <Content>
        <Title>{post.title}</Title>
        <Excerpt>{post.excerpt}</Excerpt>
        <Meta>
          <StyledDate>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</StyledDate>
          <ReadMore href={`/blog/${post._id}`} onClick={(e) => e.stopPropagation()}>
            {loadingPostId === post._id ? (
              <>
                Reading <LoadingSpinner />
              </>
            ) : (
              'Read More →'
            )}
          </ReadMore>
        </Meta>
      </Content>
    </BlogCard>
  )

  if (isLoading) {
    return (
      <Container 
        id="blog" 
        $theme={currentTheme}
        $customBackground={customBackground}
        $isThemesEnabled={isThemesEnabled}
      >
        <Wrapper>
          <SectionTitle>Loading Latest Articles...</SectionTitle>
        </Wrapper>
      </Container>
    )
  }

  if (error) {
    return (
      <Container 
        id="blog" 
        $theme={currentTheme}
        $customBackground={customBackground}
        $isThemesEnabled={isThemesEnabled}
      >
        <Wrapper>
          <SectionTitle>Error: {error}</SectionTitle>
        </Wrapper>
      </Container>
    )
  }

  return (
    <Container 
      id="blog" 
      $theme={currentTheme}
      $customBackground={customBackground}
      $isThemesEnabled={isThemesEnabled}
    >
      <Wrapper>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Latest Articles</SectionTitle>
        </motion.div>

        {blogPosts.length === 0 ? (
          <div className="text-white text-xl text-center">No blog posts found.</div>
        ) : isMobile ? (
          <MobileBlogScrollContainer>
            {blogPosts.map((post, index) => (
              <MobileBlogCard
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {renderBlogCard(post, index)}
              </MobileBlogCard>
            ))}
          </MobileBlogScrollContainer>
        ) : (
          <BlogGrid>
            {blogPosts.map((post, index) => renderBlogCard(post, index))}
          </BlogGrid>
        )}
      </Wrapper>
    </Container>
  )
}