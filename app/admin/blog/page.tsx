'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FaArrowLeft, FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa'
import config from '@/components/config'


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

export default function BlogList() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${config.CURRENT_URL}/api/blog`)
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setDeletingId(id)
      try {
        await fetch(`${config.CURRENT_URL}/api/blog/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        })
        fetchPosts()
      } catch (error) {
        console.error('Error deleting blog post:', error)
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#191924] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 mt-20">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#854CE6] hover:text-[#6c3cb8] transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#854CE6] to-[#6c3cb8] bg-clip-text text-transparent">
              Blog Management
            </h1>
            <button
              onClick={() => router.push('/admin/blog/create')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-green-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[#191924]"
            >
              <FaPlus className="inline-block mr-2" />
              New Post
            </button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="text-center text-xl text-gray-400">Loading blog posts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div
                key={post._id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl transform transition-all duration-500 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                <p className="text-gray-300 mb-4">{post.excerpt.substring(0, 100)}...</p>
                <div className="flex items-center gap-4 text-gray-400 mb-4">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FaEye className="text-[#854CE6]" />
                    {post.views}
                  </span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/admin/blog/edit/${post._id}`)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#191924]"
                  >
                    <FaEdit className="inline-block mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={deletingId === post._id}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#191924] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTrash className="inline-block mr-2" />
                    {deletingId === post._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 