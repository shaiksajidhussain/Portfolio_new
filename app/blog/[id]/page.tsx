'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { FaTwitter, FaLinkedin, FaFacebook, FaBookmark, FaRegBookmark,  FaEye } from 'react-icons/fa'
import config from '@/components/config'
import he from 'he'

const SkeletonLoader = () => (
  <div className="min-h-screen bg-[#191924] text-white p-6">
    <div className="max-w-4xl mx-auto mt-20">
      {/* Title Skeleton */}
      <div className="h-12 bg-gray-700 rounded-lg animate-pulse mb-8 w-3/4"></div>
      
      {/* Image Skeleton */}
      <div className="w-full h-[400px] bg-gray-700 rounded-lg animate-pulse mb-8"></div>
      
      {/* Content Skeletons */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-700 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-4/6"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6"></div>
      </div>
      
      {/* Meta Info Skeleton */}
      <div className="mt-8 flex items-center gap-4">
        <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-32"></div>
      </div>
    </div>
  </div>
)

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

export default function BlogPost() {
  const router = useRouter()
  const params = useParams()
  const postId = params?.id as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (!postId) {
      setError('Invalid blog post ID')
      setIsLoading(false)
      return
    }

    const fetchPost = async () => {
      try {
        const response = await fetch(`${config.CURRENT_URL}/api/blog/${postId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch blog post')
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError('Failed to load blog post')
        console.error('Error fetching blog post:', err)
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
    return <SkeletonLoader />
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#191924] text-white p-6 flex items-center justify-center">
        <div className="text-red-400">{error || 'Blog post not found'}</div>
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/#blog')}
          className="flex items-center text-[#854CE6] hover:text-[#6c3cb8] transition-colors mb-8 mt-20"
        >
          {/* <FaArrowLeft className="mr-2" /> Back to Home */}
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
        <article className="prose prose-invert lg:prose-xl mx-auto">
          <div 
            className="prose-headings:text-[#854CE6] prose-a:text-[#854CE6] prose-strong:text-[#854CE6] prose-p:text-gray-300 prose-li:text-gray-300 prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-a:underline prose-a:decoration-[#854CE6] prose-a:underline-offset-4 hover:prose-a:decoration-2 prose-table:border-collapse prose-table:w-full prose-table:text-left prose-th:border prose-th:border-gray-400 prose-th:px-4 prose-th:py-2 prose-th:bg-gray-800 prose-td:border prose-td:border-gray-400 prose-td:px-4 prose-td:py-2 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-[#854CE6] prose-img:rounded-xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: he.decode(post.content) }}
          />
        </article>

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