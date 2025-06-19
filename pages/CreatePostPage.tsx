import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "../hooks/usePosts";
import { getCurrentLocation, extractHashtags } from "../lib/utils";
import { Camera, MapPin, Hash, X, Upload, Loader } from "lucide-react";

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createPostMutation = useCreatePost();

  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    image: null as File | null,
    tags: [] as string[],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    name?: string;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("Image size must be less than 10MB");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleGetLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const coords = await getCurrentLocation();
      if (coords) {
        setLocation(coords);
        // You could add reverse geocoding here to get location name
        setLocation((prev) => ({ ...prev!, name: "Current Location" }));
      } else {
        setError(
          "Unable to get location. Please check your browser permissions."
        );
      }
    } catch (err) {
      setError("Failed to get location");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      caption: value,
      tags: extractHashtags(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.image) {
      setError("Please select an image");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        title: formData.title,
        caption: formData.caption,
        image: formData.image,
        tags: formData.tags,
        location: location || undefined,
      });

      navigate("/");
    } catch (err) {
      setError("Failed to create post. Please try again.");
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Share a New Spot</h1>
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo *
            </label>

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
              >
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload a photo</p>
                <p className="text-sm text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-96 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Give your spot a memorable title..."
              className="input-field"
              maxLength={100}
              required
            />
          </div>

          {/* Caption */}
          <div>
            <label
              htmlFor="caption"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Caption
            </label>
            <textarea
              id="caption"
              value={formData.caption}
              onChange={handleCaptionChange}
              placeholder="Tell us about this amazing spot... Use #hashtags to categorize!"
              className="input-field h-32 resize-none"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.caption.length}/500 characters
            </p>
          </div>

          {/* Tags */}
          {formData.tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <Hash className="w-3 h-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLoadingLocation}
                className="btn-secondary flex items-center space-x-2"
              >
                {isLoadingLocation ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                <span>
                  {isLoadingLocation
                    ? "Getting location..."
                    : "Add Current Location"}
                </span>
              </button>

              {location && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{location.name || "Current Location"}</span>
                  <button
                    type="button"
                    onClick={() => setLocation(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                createPostMutation.isPending ||
                !formData.image ||
                !formData.title
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {createPostMutation.isPending ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Sharing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Share Spot</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
