'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaSpinner } from 'react-icons/fa'
import config from '@/components/config'

interface BlogPost {
  title: string
  content: string
  excerpt: string
  image: string
  author: string
  readTime: string
  status: 'draft' | 'published'
}

export default function CreateBlogPost() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    author: '',
    readTime: '',
    status: 'draft'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${config.CURRENT_URL}/api/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create blog post')
      }

      router.push('/admin/blog')
    } catch (error) {
      console.error('Error creating blog post:', error)
      alert(error instanceof Error ? error.message : 'Failed to create blog post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-[#191924] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#854CE6] hover:text-[#6c3cb8] transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#854CE6] to-[#6c3cb8] bg-clip-text text-transparent">
            Create New Blog Post
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
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
              className="w-full px-4 py-2 bg-[#2D2D3A] border border-[#3D3D4A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-[#2D2D3A] border border-[#3D3D4A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              className="w-full px-4 py-2 bg-[#2D2D3A] border border-[#3D3D4A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#2D2D3A] border border-[#3D3D4A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
              required
            />
          </div>

          {/* Author */}
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
              className="w-full px-4 py-2 bg-[#2D2D3A] border border-[#3D3D4A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
              required
            />
          </div>

          {/* Read Time */}
          <div>
            <label htmlFor="readTime" className="block text-sm font-medium text-gray-300 mb-2">
              Read Time
            </label>
            <input
              type="text"
              id="readTime"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              placeholder="e.g., 5 min read"
              className="w-full px-4 py-2 bg-[#2D2D3A] border border-[#3D3D4A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#2D2D3A] border border-[#3D3D4A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#854CE6] focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#854CE6] hover:bg-[#6c3cb8] text-white font-semibold rounded-lg shadow-lg hover:shadow-[#854CE6]/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#854CE6] focus:ring-offset-2 focus:ring-offset-[#191924] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Creating...
                </div>
              ) : (
                'Create Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 