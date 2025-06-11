'use client'

interface PostFilterProps {
  filters: {
    date: string
    popularity: string
  }
  onFilterChange: (filters: { date: string; popularity: string }) => void
}

export function PostFilter({ filters, onFilterChange }: PostFilterProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      date: e.target.value,
    })
  }

  const handlePopularityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      popularity: e.target.value,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Filter Posts</h2>
      
      <div className="space-y-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date
          </label>
          <select
            id="date"
            value={filters.date}
            onChange={handleDateChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-sunset focus:ring-sunset"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="popularity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Popularity
          </label>
          <select
            id="popularity"
            value={filters.popularity}
            onChange={handlePopularityChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-sunset focus:ring-sunset"
          >
            <option value="all">All Posts</option>
            <option value="most_liked">Most Liked</option>
            <option value="most_commented">Most Commented</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>
    </div>
  )
} 