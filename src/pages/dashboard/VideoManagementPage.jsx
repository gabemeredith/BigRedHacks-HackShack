import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VideoManagementPage = () => {
  const { userInfo } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = userInfo.token;
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/dashboard/videos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch videos');
      }

      setVideos(result.data || []);
    } catch (err) {
      console.error('Fetch videos error:', err);
      setError(err.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = userInfo.token;
      
      const response = await fetch(`/api/dashboard/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete video');
      }

      // Remove video from local state
      setVideos(prev => prev.filter(video => video._id !== videoId));
    } catch (err) {
      console.error('Delete video error:', err);
      alert(err.message || 'Failed to delete video');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const extractYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (url) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Videos</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchVideos}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Management</h1>
          <p className="text-gray-600">
            Manage your uploaded videos. New videos appear at the top of the reels page.
          </p>
        </div>
        <Link
          to="/dashboard/videos/upload"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload New Video
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📹</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Videos Yet</h3>
          <p className="text-gray-600 mb-6">
            Upload your first video to start engaging with the community.
          </p>
          <Link
            to="/dashboard/videos/upload"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Your First Video
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {videos.length} video{videos.length !== 1 ? 's' : ''} • 
              Most recent videos appear first in the reels feed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const thumbnailUrl = getThumbnailUrl(video.url);
              const videoId = extractYouTubeId(video.url);
              
              return (
                <div key={video._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gray-200 relative">
                    {thumbnailUrl ? (
                      <img 
                        src={thumbnailUrl} 
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Play Button Overlay */}
                    {videoId && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 transition-all"
                        >
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {video.caption || 'No caption'}
                      </p>
                    </div>

                    {/* Tags */}
                    {video.tags && video.tags.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {video.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                          {video.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{video.tags.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Uploaded {formatDate(video.createdAt)}</span>
                      <span>ID: {video._id.slice(-8)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded font-medium transition-colors text-center"
                      >
                        View on YouTube
                      </a>
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 text-sm px-3 py-2 rounded font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoManagementPage;
