'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import config from '@/components/config';

interface BlogPost {
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  readTime: string;
  status: 'draft' | 'published';
}

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    author: '',
    readTime: '',
    status: 'draft'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPost(params.id)
  }, [params.id])

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`${config.CURRENT_URL}/api/blog/${id}`)
      const data = await response.json()
      setFormData({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        image: data.image,
        author: data.author,
        readTime: data.readTime,
        status: data.status
      })
    } catch (error) {
      console.error('Error fetching blog post:', error)
      setError('Failed to fetch blog post')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${config.CURRENT_URL}/api/blog/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update blog post')
      }

      router.push('/admin/blog')
    } catch (error) {
      console.error('Error updating blog post:', error)
      setError(error instanceof Error ? error.message : 'Failed to update blog post')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#191924] text-white p-6">
      <div className="max-w-4xl mx-auto mt-20">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#854CE6] hover:text-[#6c3cb8] transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Blog List
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#854CE6] to-[#6c3cb8] bg-clip-text text-transparent">
            Edit Blog Post
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="readTime" className="block text-sm font-medium text-gray-300 mb-2">
              Read Time (e.g., "5 min read")
            </label>
            <input
              type="text"
              id="readTime"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-[#854CE6] hover:bg-[#6c3cb8] text-white font-semibold rounded-lg shadow-lg hover:shadow-[#854CE6]/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#854CE6] focus:ring-offset-2 focus:ring-offset-[#191924] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Update Post'}
          </button>
        </form>
      </div>
    </div>
  )
} 