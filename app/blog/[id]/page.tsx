'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaTwitter, FaLinkedin, FaFacebook, FaBookmark, FaRegBookmark, FaArrowLeft, FaEye } from 'react-icons/fa'
import config from '@/components/config'

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  author: string;
  readTime: string;
  date: string;
  views: number;
  status: 'draft' | 'published';
}

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = React.use(params)
  const postId = resolvedParams.id

  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${config.CURRENT_URL}/api/blog/${postId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
        console.error('Error fetching blog post:', err)
        setError('Failed to load blog post.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPost()
  }, [postId])

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setReadingProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = post?.title || ''

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
        break
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#191924] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading blog post...</h1>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#191924] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error: {error}</h1>
          <button
            onClick={() => router.push('/#blog')}
            className="px-6 py-2 bg-[#854CE6] text-white rounded-lg hover:bg-[#6c3cb8] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#191924] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <button
            onClick={() => router.push('/#blog')}
            className="px-6 py-2 bg-[#854CE6] text-white rounded-lg hover:bg-[#6c3cb8] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#191924] text-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#2D2D3A] z-50">
        <div
          className="h-full bg-[#854CE6] transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/#blog')}
          className="flex items-center text-[#854CE6] hover:text-[#6c3cb8] transition-colors mb-8 mt-20"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#854CE6] to-[#6c3cb8] bg-clip-text text-transparent">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-400">
            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.readTime}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FaEye className="text-[#854CE6]" />
              {post.views} views
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Main Content */}
        <div className="prose prose-invert max-w-none">
          <div className="prose-headings:text-[#854CE6] prose-a:text-[#854CE6] prose-strong:text-[#854CE6]">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('##')) {
                const id = paragraph.replace('##', '').trim().toLowerCase().replace(/\s+/g, '-')
                return (
                  <h2 key={index} id={id} className="text-2xl font-bold mt-8 mb-4">
                    {paragraph.replace('##', '').trim()}
                  </h2>
                )
              }
              if (paragraph.startsWith('###')) {
                return (
                  <h3 key={index} className="text-xl font-bold mt-6 mb-3">
                    {paragraph.replace('###', '').trim()}
                  </h3>
                )
              }
              if (paragraph.startsWith('-')) {
                return (
                  <ul key={index} className="list-disc pl-6 mb-4">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i}>{item.replace('-', '').trim()}</li>
                    ))}
                  </ul>
                )
              }
              if (paragraph.startsWith('1.')) {
                return (
                  <ol key={index} className="list-decimal pl-6 mb-4">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i}>{item.replace(/^\d+\./, '').trim()}</li>
                    ))}
                  </ol>
                )
              }
              return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
            })}
          </div>
        </div>

        {/* Social Share */}
        <div className="mt-12 pt-8 border-t border-[#2D2D3A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Share this article:</span>
              <div className="flex gap-3">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 text-gray-400 hover:text-[#854CE6] transition-colors"
                >
                  <FaTwitter size={20} />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 text-gray-400 hover:text-[#854CE6] transition-colors"
                >
                  <FaLinkedin size={20} />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 text-gray-400 hover:text-[#854CE6] transition-colors"
                >
                  <FaFacebook size={20} />
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-2 text-gray-400 hover:text-[#854CE6] transition-colors"
            >
              {isBookmarked ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 