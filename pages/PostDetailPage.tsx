import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  usePost,
  usePostComments,
  useCreateComment,
  useLikePost,
} from "../hooks/usePosts";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  User,
  Send,
  MoreHorizontal,
} from "lucide-react";
import { formatTimeAgo, formatNumber } from "../lib/utils";

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");

  const { data: post, isLoading: postLoading } = usePost(id!);
  const { data: comments, isLoading: commentsLoading } = usePostComments(id!);
  const createCommentMutation = useCreateComment();
  const likeMutation = useLikePost();

  const handleLike = () => {
    if (user && post) {
      likeMutation.mutate({ postId: post.id, isLiked: post.isLiked });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    try {
      await createCommentMutation.mutateAsync({
        postId: id,
        content: newComment.trim(),
      });
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  if (postLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-24 mb-6"></div>
          <div className="card overflow-hidden">
            <div className="h-96 bg-gray-300"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Post not found
        </h2>
        <p className="text-gray-600 mb-6">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Feed</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Post */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Link
                to={`/profile/${post.user.username}`}
                className="flex items-center space-x-3"
              >
                {post.user.profilePhoto ? (
                  <img
                    src={post.user.profilePhoto}
                    alt={post.user.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
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
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              {post.location && (
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {post.location.name}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className={`p-3 rounded-lg transition-colors ${
                      post.isLiked
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        post.isLiked ? "fill-current" : ""
                      }`}
                    />
                  </button>

                  <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MessageCircle className="w-6 h-6" />
                  </button>

                  <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>

                <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bookmark className="w-6 h-6" />
                </button>
              </div>

              {/* Like count */}
              {post.likesCount > 0 && (
                <p className="font-semibold text-gray-900 mb-3">
                  {formatNumber(post.likesCount)}{" "}
                  {post.likesCount === 1 ? "like" : "likes"}
                </p>
              )}

              {/* Title and Caption */}
              <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  {post.title}
                </h1>
                <p className="text-gray-700 whitespace-pre-line">
                  {post.caption}
                </p>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <button
                      key={index}
                      className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 py-1 rounded transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <p className="text-gray-400 text-sm uppercase tracking-wide">
                {formatTimeAgo(post.createdAt)}
              </p>

              {/* Weather info */}
              {post.weather && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Weather:</strong> {post.weather.condition},{" "}
                    {post.weather.temperature}°C
                    {post.weather.humidity &&
                      ` • ${post.weather.humidity}% humidity`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                Comments ({post.commentsCount})
              </h3>
            </div>

            {/* Comment Form */}
            {user && (
              <form
                onSubmit={handleComment}
                className="p-4 border-b border-gray-200"
              >
                <div className="flex space-x-3">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={
                          !newComment.trim() || createCommentMutation.isPending
                        }
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm px-3 py-1.5"
                      >
                        <Send className="w-4 h-4" />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="max-h-96 overflow-y-auto">
              {commentsLoading ? (
                <div className="p-4 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments && comments.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4">
                      <div className="flex space-x-3">
                        {comment.user.profilePhoto ? (
                          <img
                            src={comment.user.profilePhoto}
                            alt={comment.user.displayName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Link
                              to={`/profile/${comment.user.username}`}
                              className="font-medium text-gray-900 hover:text-gray-700"
                            >
                              {comment.user.displayName}
                            </Link>
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No comments yet</p>
                  <p className="text-sm text-gray-500">
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
