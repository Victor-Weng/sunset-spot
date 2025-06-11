'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

interface Post {
  id: string
  caption: string
  imageUrl: string
  locationLat: number
  locationLng: number
  createdAt: string
  author: {
    id: string
    name: string
    avatar: string | null
  }
  likes: number
  comments: number
}

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to like post')
      }

      // Update local state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes + 1,
          }
        }
        return post
      }))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sunset"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <article
          key={post.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="relative h-64">
            <Image
              src={post.imageUrl}
              alt={post.caption}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500">
                    {post.author.name[0]}
                  </span>
                </div>
              )}
              <Link
                href={`/profile/${post.author.id}`}
                className="font-medium hover:text-sunset"
              >
                {post.author.name}
              </Link>
            </div>
            <p className="text-gray-700 mb-4">{post.caption}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-1 hover:text-sunset"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>{post.comments}</span>
                </div>
              </div>
              <time dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
} 