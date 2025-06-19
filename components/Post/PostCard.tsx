import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Post } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useLikePost } from "../../hooks/usePosts";
import {
  Heart,
  MessageCircle,
  MapPin,
  User,
  MoreHorizontal,
  Bookmark,
} from "lucide-react";
import { formatTimeAgo, formatNumber } from "../../lib/utils";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const likeMutation = useLikePost();
  const [showFullCaption, setShowFullCaption] = useState(false);

  const handleLike = () => {
    if (user) {
      likeMutation.mutate({ postId: post.id, isLiked: post.isLiked });
    }
  };

  const truncatedCaption =
    post.caption.length > 150
      ? post.caption.substring(0, 150) + "..."
      : post.caption;

  return (
    <article className="card overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link
          to={`/profile/${post.user.username}`}
          className="flex items-center space-x-3"
        >
          {post.user.profilePhoto ? (
            <img
              src={post.user.profilePhoto}
              alt={post.user.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">
              {post.user.displayName}
            </p>
            <p className="text-sm text-gray-500">@{post.user.username}</p>
          </div>
        </Link>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-96 object-cover"
        />
        {post.location && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{post.location.name}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`p-2 rounded-lg transition-colors ${
                post.isLiked
                  ? "text-red-500 hover:bg-red-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Heart
                className={`w-6 h-6 ${post.isLiked ? "fill-current" : ""}`}
              />
            </button>

            <Link
              to={`/post/${post.id}`}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </Link>
          </div>

          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Like count */}
        {post.likesCount > 0 && (
          <p className="font-semibold text-gray-900 mb-2">
            {formatNumber(post.likesCount)}{" "}
            {post.likesCount === 1 ? "like" : "likes"}
          </p>
        )}

        {/* Caption */}
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
          <p className="text-gray-700">
            {showFullCaption ? post.caption : truncatedCaption}
            {post.caption.length > 150 && (
              <button
                onClick={() => setShowFullCaption(!showFullCaption)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                {showFullCaption ? "show less" : "more"}
              </button>
            )}
          </p>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="text-primary-600 hover:text-primary-700 cursor-pointer text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments link */}
        {post.commentsCount > 0 && (
          <Link
            to={`/post/${post.id}`}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            View all {post.commentsCount} comments
          </Link>
        )}

        {/* Timestamp */}
        <p className="text-gray-400 text-xs mt-2 uppercase tracking-wide">
          {formatTimeAgo(post.createdAt)}
        </p>

        {/* Weather info */}
        {post.weather && (
          <div className="mt-2 text-sm text-gray-600">
            Weather: {post.weather.condition}, {post.weather.temperature}°C
          </div>
        )}
      </div>
    </article>
  );
};
