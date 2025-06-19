import React, { useState } from "react";
import { PostCard } from "../components/Post/PostCard";
import { useFeedPosts } from "../hooks/usePosts";
import {
  Search,
  TrendingUp,
  MapPin,
  Hash,
  Calendar,
  Flame,
} from "lucide-react";

export const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "trending" | "recent" | "nearby" | "tags"
  >("trending");
  const { data: posts, isLoading } = useFeedPosts();

  const filters = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "recent", label: "Recent", icon: Calendar },
    { id: "nearby", label: "Nearby", icon: MapPin },
    { id: "tags", label: "Tags", icon: Hash },
  ];

  const popularTags = [
    "forest",
    "mountain",
    "sunset",
    "hiking",
    "waterfall",
    "beach",
    "wildflowers",
    "wildlife",
    "sunrise",
    "adventure",
  ];

  const trendingSpots = [
    { name: "Yosemite Valley", count: 234 },
    { name: "Grand Canyon", count: 189 },
    { name: "Yellowstone", count: 156 },
    { name: "Rocky Mountains", count: 143 },
    { name: "Pacific Coast", count: 128 },
  ];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-300 rounded"></div>
          <div className="flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-300 rounded w-24"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore</h1>
        <p className="text-gray-600">
          Discover amazing nature spots from around the world
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search spots, users, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-8 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter.id
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <filter.icon className="w-4 h-4" />
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeFilter === "trending" && (
            <div className="mb-6 card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Trending Now
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trendingSpots.map((spot, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <p className="font-semibold text-gray-900">{spot.name}</p>
                    <p className="text-sm text-gray-600">{spot.count} posts</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Grid */}
          <div className="space-y-6">
            {posts?.slice(0, 9).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center py-8">
            <button className="btn-secondary">Load More</button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Tags */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Hash className="w-5 h-5" />
              <span>Popular Tags</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  className="text-sm bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 px-3 py-1 rounded-full transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Users */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Featured Photographers
            </h3>
            <div className="space-y-4">
              {[
                {
                  name: "Alex Rivera",
                  username: "alexnature",
                  followers: "12.4K",
                  image: null,
                },
                {
                  name: "Maya Chen",
                  username: "wildmaya",
                  followers: "8.9K",
                  image: null,
                },
                {
                  name: "Jake Mountain",
                  username: "peakseeker",
                  followers: "15.2K",
                  image: null,
                },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <button className="btn-primary text-sm py-1 px-3">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Community Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Posts</span>
                <span className="font-semibold text-gray-900">24.7K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Users</span>
                <span className="font-semibold text-gray-900">3.2K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Locations</span>
                <span className="font-semibold text-gray-900">1.8K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Countries</span>
                <span className="font-semibold text-gray-900">89</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
