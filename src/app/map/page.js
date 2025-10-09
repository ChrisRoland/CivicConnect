"use client";

import { useState, useEffect, useRef } from "react";
import { Filter, X, TrendingUp } from "lucide-react";
import { getIssues } from "@/lib/supabase";
import Header from "@/components/Header";
// import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";

// Import map component dynamically to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function MapPage() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]); // New York City
  const [mapZoom, setMapZoom] = useState(13);
  const mapRef = useRef(null);
  const markerRefs = useRef({});

  // Default center (you can change this to your city)
  const defaultCenter = [40.7128, -74.006]; // New York City fallback

  useEffect(() => {
    loadIssues();

    // Get user's location after component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          // User denied location or error occurred, mapCenter remains default
          console.log(
            "User location not available. Using default center.",
            error
          );
        }
      );
    }
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issues, filters]);

  async function loadIssues() {
    try {
      const data = await getIssues();
      // Only show issues with coordinates
      const issuesWithCoords = data.filter((i) => i.latitude && i.longitude);
      setIssues(issuesWithCoords);
    } catch (error) {
      console.error("Error loading issues:", error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...issues];

    if (filters.status !== "all") {
      filtered = filtered.filter((i) => i.status === filters.status);
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((i) => i.category === filters.category);
    }

    setFilteredIssues(filtered);
  }

  function getMarkerColor(status) {
    switch (status) {
      case "reported":
        return "#f97316"; // orange
      case "in-progress":
        return "#3b82f6"; // blue
      case "resolved":
        return "#10b981"; // green
      default:
        return "#6b7280"; // gray
    }
  }

  function handleIssueClick(issue) {
    setSelectedIssue(issue);
    // Fly to the issue location on the map
    if (mapRef.current) {
      mapRef.current.flyTo([issue.latitude, issue.longitude], 16, {
        duration: 1.5,
      });
    }
    // Open the marker popup
    setTimeout(() => {
      if (markerRefs.current[issue.id]) {
        markerRefs.current[issue.id].openPopup();
      }
    }, 1600);
  }

  const categories = [
    "Infrastructure",
    "Public Safety",
    "Environment",
    "Public Services",
    "Community",
    "Transportation",
    "Parks & Recreation",
    "Other",
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      {/* Header */}
      <Header />

      {/* Page Controls */}
      <div className="absolute top-20 left-8 border-gray-200 px-4 py-3 z-[1000]">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2 ${
            showFilters ? "hidden" : "bg-green-600"
          } text-white rounded-lg hover:bg-green-700 transition cursor-pointer`}
        >
          {showFilters ? <X size={18} /> : <Filter size={18} />}
          <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
        </button>
      </div>

      <div className="flex-1 flex relative">
        {/* Sidebar - Filters and List */}
        <div
          className={`${
            showFilters ? "w-80" : "w-0"
          } transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}
        >
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-100 rounded cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Status Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
              >
                <option value="all">All Statuses</option>
                <option value="reported">Reported</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">{filteredIssues.length}</span>{" "}
                of <span className="font-semibold">{issues.length}</span> issues
              </p>
            </div>

            {/* Issue List */}
            <div className="space-y-3">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => handleIssueClick(issue)}
                  className={`p-3 bg-gray-50 rounded-lg border-2 cursor-pointer transition ${
                    selectedIssue?.id === issue.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-gray-900">
                      {issue.title}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        issue.status === "reported"
                          ? "bg-orange-100 text-orange-700"
                          : issue.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {issue.location_name || "No location"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                      {issue.category}
                    </span>
                    <span className="text-xs text-gray-600 flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      {issue.upvotes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <Image
                  src="/assets/ccLoading.gif"
                  alt="Loading"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredIssues.map((issue) => (
                <Marker
                  key={issue.id}
                  position={[issue.latitude, issue.longitude]}
                  ref={(ref) => {
                    if (ref) {
                      markerRefs.current[issue.id] = ref;
                    }
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-gray-900 mb-2">
                        {issue.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {issue.description}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            issue.status === "reported"
                              ? "bg-orange-100 text-orange-700"
                              : issue.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {issue.status.replace("-", " ")}
                        </span>
                        <span className="text-xs text-gray-600 flex items-center">
                          <TrendingUp size={14} className="mr-1" />
                          {issue.upvotes} votes
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{issue.category}</p>
                      {issue.image_url && (
                        <Image
                          src={issue.image_url}
                          alt={issue.title}
                          className="mt-2 rounded w-full h-32 object-cover"
                          width={500}
                          height={200}
                        />
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Legend */}
          {/* <div
            className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200"
            style={{ zIndex: 9999 }}
          >
            <h4 className="font-semibold text-sm text-gray-900 mb-2">
              Status Legend
            </h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs text-gray-600">Reported</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">Resolved</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
