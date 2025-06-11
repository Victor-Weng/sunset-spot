'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Map } from '@/components/map/Map'
import { PostFilter } from '@/components/map/PostFilter'

export default function Explore() {
  const [filters, setFilters] = useState({
    date: 'all',
    popularity: 'all',
  })

  return (
    <main>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <PostFilter filters={filters} onFilterChange={setFilters} />
          </div>
          <div className="w-full md:w-3/4 h-[600px] rounded-lg overflow-hidden shadow-lg">
            <Map filters={filters} />
          </div>
        </div>
      </div>
    </main>
  )
} 