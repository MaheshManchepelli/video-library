import React from 'react';

const VideoCard = ({ video, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{video.description}</p>
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-1 rounded">{video.category}</span>
          <span>{video.duration}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{video.views} views</span>
          <span>{video.likes} likes</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Uploaded by {video.uploadedBy} on {new Date(video.uploadDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
