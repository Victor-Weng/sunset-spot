'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Image from 'next/image'

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface Post {
  id: string
  caption: string
  imageUrl: string
  locationLat: number
  locationLng: number
  author: {
    name: string
  }
}

interface MapProps {
  filters: {
    date: string
    popularity: string
  }
}

export function Map({ filters }: MapProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [filters])

  const fetchPosts = async () => {
    try {
      const queryParams = new URLSearchParams({
        date: filters.date,
        popularity: filters.popularity,
      })

      const response = await fetch(`/api/posts/map?${queryParams}`)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sunset"></div>
      </div>
    )
  }

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {posts.map(post => (
        <Marker
          key={post.id}
          position={[post.locationLat, post.locationLng]}
          icon={icon}
        >
          <Popup>
            <div className="w-48">
              <div className="relative h-32 mb-2">
                <Image
                  src={post.imageUrl}
                  alt={post.caption}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-sm text-gray-600">{post.caption}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
} 