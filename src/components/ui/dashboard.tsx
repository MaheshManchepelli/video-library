import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from './video-card';

// TopBar Component
const TopBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="flex items-center justify-between bg-white shadow-sm px-4 py-3 mb-6 rounded-lg sticky top-0 z-10">
      {/* Left: Logo */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-blue-600">Mana Videos</h1>
      </div>

      {/* Middle: Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 mx-4">
        <div className="relative w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search videos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Right: User Icon */}
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchVideos = async (query = '') => {
    try {
      const res = await axios.get(`http://localhost:5000/api/videos?q=${query}`);
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchVideosByCategory = async (category) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/videos/category/${category}`);
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching videos by category:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleBack = () => {
    setSelectedVideo(null);
    fetchVideos();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      fetchVideos();
    } else {
      fetchVideosByCategory(category);
    }
  };

  const handleSearch = (query) => {
    fetchVideos(query);
  };

  const suggestedVideos = selectedVideo
    ? videos.filter(video => video.category === selectedVideo.category && video._id !== selectedVideo._id)
    : [];

  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button
          onClick={handleBack}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>

        {/* Video Player Section (unchanged) */}
        <div className="mb-8 bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="relative pb-[56.25%] bg-black">
            <video
              controls
              autoPlay
              className="absolute top-0 left-0 w-full h-full"
              src={selectedVideo.url}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="p-4">
            <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
            <p className="text-gray-600 mt-2">{selectedVideo.description}</p>
            <div className="flex justify-between text-sm text-gray-500 mt-3">
              <span>{selectedVideo.views} views</span>
              <span>{selectedVideo.likes} likes</span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Related Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {suggestedVideos.map(video => (
            <VideoCard
              key={video._id}
              video={video}
              onClick={() => handleVideoClick(video)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Top Bar */}
      <TopBar onSearch={handleSearch} />

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleCategoryClick('All')}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category.name)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category.name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map(video => (
          <VideoCard
            key={video._id}
            video={video}
            onClick={() => handleVideoClick(video)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
