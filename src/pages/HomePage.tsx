import React from "react";
import { PostCard } from "../components/Post/PostCard";
import { useFeedPosts } from "../hooks/usePosts";
import { Heart, Users, TrendingUp } from "lucide-react";

export const HomePage: React.FC = () => {
  const { data: posts, isLoading, error } = useFeedPosts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card overflow-hidden animate-pulse">
            <div className="flex items-center space-x-3 p-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-3 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
            <div className="h-96 bg-gray-300"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Heart className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600">
          Unable to load posts. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Welcome message for first-time users */}
      {posts && posts.length === 0 && (
        <div className="card p-8 text-center mb-6">
          <div className="text-primary-500 mb-4">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to Spot!
          </h3>
          <p className="text-gray-600 mb-4">
            Start following other nature lovers to see their amazing spots in
            your feed.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/explore" className="btn-primary">
              Explore Spots
            </a>
            <a href="/create" className="btn-secondary">
              Share Your First Spot
            </a>
          </div>
        </div>
      )}

      {/* Stats cards for engagement */}
      {posts && posts.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-nature-500 mb-2">
              <Heart className="w-6 h-6 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {posts.reduce((acc, post) => acc + post.likesCount, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Likes</p>
          </div>

          <div className="card p-4 text-center">
            <div className="text-primary-500 mb-2">
              <TrendingUp className="w-6 h-6 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            <p className="text-sm text-gray-600">Recent Posts</p>
          </div>

          <div className="card p-4 text-center">
            <div className="text-orange-500 mb-2">
              <Users className="w-6 h-6 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(posts.map((post) => post.userId)).size}
            </p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
        </div>
      )}

      {/* Posts feed */}
      <div className="space-y-0">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load more button (placeholder for infinite scroll) */}
      {posts && posts.length > 0 && (
        <div className="text-center py-8">
          <button className="btn-secondary">Load More Posts</button>
        </div>
      )}
    </div>
  );
};
