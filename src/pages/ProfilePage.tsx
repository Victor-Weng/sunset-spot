import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUserPosts } from "../hooks/usePosts";
import {
  User,
  MapPin,
  Calendar,
  Settings,
  Grid3X3,
  Heart,
  MessageCircle,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { formatNumber, formatTimeAgo } from "../lib/utils";

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"posts" | "liked">("posts");

  // Mock user data - in a real app, you'd fetch this based on username
  const profileUser = {
    id: "1",
    username: username || "demo",
    email: "demo@spot.com",
    displayName: "Nature Explorer",
    bio: "🌲 Nature photographer & hiking enthusiast\n📍 Based in Colorado\n✨ Sharing the beauty of the outdoors",
    profilePhoto: undefined,
    isPrivate: false,
    followersCount: 1234,
    followingCount: 567,
    postsCount: 89,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  };

  const { data: posts, isLoading } = useUserPosts(profileUser.id);
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnProfile = currentUser?.username === username;

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // In a real app, this would call an API
  };

  const tabs = [
    { id: "posts", label: "Posts", icon: Grid3X3 },
    { id: "liked", label: "Liked", icon: Heart },
  ];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card p-6 mb-6 animate-pulse">
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-gray-300 rounded w-48"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            {profileUser.profilePhoto ? (
              <img
                src={profileUser.profilePhoto}
                alt={profileUser.displayName}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-gray-600" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {profileUser.displayName}
                </h1>
                <p className="text-gray-600">@{profileUser.username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4 sm:mt-0">
                {isOwnProfile ? (
                  <Link
                    to="/settings"
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Link>
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isFollowing
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-primary-500 text-white hover:bg-primary-600"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        <span>Unfollow</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex space-x-8 mb-4">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  {formatNumber(profileUser.postsCount)}
                </p>
                <p className="text-sm text-gray-600">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  {formatNumber(profileUser.followersCount)}
                </p>
                <p className="text-sm text-gray-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  {formatNumber(profileUser.followingCount)}
                </p>
                <p className="text-sm text-gray-600">Following</p>
              </div>
            </div>

            {/* Bio */}
            {profileUser.bio && (
              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-line">
                  {profileUser.bio}
                </p>
              </div>
            )}

            {/* Joined Date */}
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Joined {formatTimeAgo(profileUser.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "posts" | "liked")}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((post) => (
          <Link
            key={post.id}
            to={`/post/${post.id}`}
            className="group card overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Overlay with stats */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-4 text-white">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-5 h-5" />
                    <span>{formatNumber(post.likesCount)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-5 h-5" />
                    <span>{formatNumber(post.commentsCount)}</span>
                  </div>
                </div>
              </div>

              {/* Location badge */}
              {post.location && (
                <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{post.location.name}</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {post.caption}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {posts && posts.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Grid3X3 className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === "posts" ? "No posts yet" : "No liked posts"}
          </h3>
          <p className="text-gray-600">
            {isOwnProfile
              ? "Share your first nature spot to get started!"
              : `${profileUser.displayName} hasn't shared any spots yet.`}
          </p>
          {isOwnProfile && activeTab === "posts" && (
            <Link
              to="/create"
              className="btn-primary mt-4 inline-flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Share Your First Spot</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
