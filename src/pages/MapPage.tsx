import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import { useFeedPosts } from "../hooks/usePosts";
import { getCurrentLocation } from "../lib/utils";
import {
  MapPin,
  Navigation,
  Filter,
  Heart,
  MessageCircle,
  User,
} from "lucide-react";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon for posts
const postIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

function LocationButton() {
  const map = useMap();

  const handleGoToLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        map.setView([location.latitude, location.longitude], 13);
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleGoToLocation}
          className="w-8 h-8 bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          title="Go to my location"
        >
          <Navigation className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

export const MapPage: React.FC = () => {
  const { data: posts, isLoading } = useFeedPosts();
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    40.7128, -74.006,
  ]); // Default to NYC
  const [mapZoom, setMapZoom] = useState(10);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite" | "terrain">(
    "streets"
  );

  useEffect(() => {
    // Try to get user's location on component mount
    getCurrentLocation().then((location) => {
      if (location) {
        setMapCenter([location.latitude, location.longitude]);
        setMapZoom(13);
      }
    });
  }, []);

  const getMapTileUrl = () => {
    switch (mapStyle) {
      case "satellite":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case "terrain":
        return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  };

  const postsWithLocation = posts?.filter((post) => post.location) || [];

  if (isLoading) {
    return (
      <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Map</h1>
          <p className="text-gray-600">
            Discover nature spots around the world • {postsWithLocation.length}{" "}
            locations
          </p>
        </div>

        {/* Map Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 p-1">
            {[
              { id: "streets", label: "Streets" },
              { id: "satellite", label: "Satellite" },
              { id: "terrain", label: "Terrain" },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setMapStyle(style.id as any)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  mapStyle === style.id
                    ? "bg-primary-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div className="h-96 md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden border border-gray-200">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={getMapTileUrl()}
            />

            <LocationButton />

            {postsWithLocation.map((post) => (
              <Marker
                key={post.id}
                position={[post.location!.latitude, post.location!.longitude]}
                icon={postIcon}
                eventHandlers={{
                  click: () =>
                    setSelectedPost(selectedPost === post.id ? null : post.id),
                }}
              >
                <Popup>
                  <div className="w-64">
                    <div className="flex items-center space-x-3 mb-3">
                      {post.user.profilePhoto ? (
                        <img
                          src={post.user.profilePhoto}
                          alt={post.user.displayName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {post.user.displayName}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{post.user.username}
                        </p>
                      </div>
                    </div>

                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />

                    <h3 className="font-semibold text-gray-900 mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {post.caption}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likesCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.commentsCount}</span>
                        </div>
                      </div>

                      <Link
                        to={`/post/${post.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View Post
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Legend</h4>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-gray-600">
              Nature Spots ({postsWithLocation.length})
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {postsWithLocation.length}
          </p>
          <p className="text-sm text-gray-600">Mapped Spots</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {new Set(postsWithLocation.map((p) => p.location?.region)).size}
          </p>
          <p className="text-sm text-gray-600">Regions</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {postsWithLocation.reduce((acc, post) => acc + post.likesCount, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Likes</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {new Set(postsWithLocation.map((p) => p.userId)).size}
          </p>
          <p className="text-sm text-gray-600">Contributors</p>
        </div>
      </div>
    </div>
  );
};
