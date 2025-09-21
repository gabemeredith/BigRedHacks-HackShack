import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getYouTubeId, isYouTubeUrl } from '../../lib/youtube';
import { uploadBusinessVideo } from '../../utils/api';

const VideoUploadPage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    url: '',
    caption: '',
    tags: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Form field changed:', name, '=', value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('New form data:', newData);
      return newData;
    });
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateYouTubeUrl = (url) => {
    if (!url.trim()) {
      return 'YouTube URL is required';
    }
    
    if (!isYouTubeUrl(url)) {
      return 'Please enter a valid YouTube URL (youtube.com/watch?v= or youtu.be/)';
    }
    
    const videoId = getYouTubeId(url);
    if (!videoId) {
      return 'Could not extract video ID from URL';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    console.log('=== UPLOAD FORM SUBMITTED ===');
    console.log('Form submitted with data:', formData);
    console.log('Form event:', e);
    
    // Check if user is logged in
    if (!userInfo || !userInfo.token) {
      setError('You must be logged in to upload videos. Please log in and try again.');
      return;
    }
    
    // Validate YouTube URL
    const urlError = validateYouTubeUrl(formData.url);
    if (urlError) {
      console.log('URL validation error:', urlError);
      setError(urlError);
      return;
    }
    
    setLoading(true);
    
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      console.log('Uploading video with new API utility...');
      const result = await uploadBusinessVideo('dashboard', {
        url: formData.url,
        caption: formData.caption,
        tags: tags
      });
      
      console.log('Upload successful:', result);
      
      setSuccess('Video uploaded successfully! It will appear at the top of the reels page.');
      setFormData({ url: '', caption: '', tags: '' });
      
      // Redirect to videos page after 3 seconds
      setTimeout(() => {
        navigate('/dashboard/videos');
      }, 3000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    const urlError = validateYouTubeUrl(formData.url);
    if (urlError) {
      setError(urlError);
      return;
    }
    
    const videoId = getYouTubeId(formData.url);
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Video</h1>
        <p className="text-gray-600 mb-3">
          Share your business content with the community. Your video will appear at the top of the reels page.
        </p>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/reel')}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium underline"
          >
            View Reels Page →
          </button>
          <button
            onClick={() => navigate('/dashboard/videos')}
            className="text-gray-600 hover:text-gray-700 text-sm font-medium underline"
          >
            View My Videos →
          </button>
          <button
            onClick={async () => {
              try {
                console.log('Testing API connection...');
                const response = await fetch('/api/dashboard/test', {
                  headers: {
                    'Accept': 'application/json'
                  }
                });
                
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status}`);
                }
                
                const result = await response.json();
                console.log('Test API response:', result);
                alert(`API Test: ${response.status} - ${result.message || 'No message'}`);
              } catch (error) {
                console.error('API test error:', error);
                alert(`API Test failed: ${error.message}`);
              }
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
          >
            Test API →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* YouTube URL Field */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={loading || !formData.url.trim()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Preview
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Paste your YouTube video URL here. The video will be embedded in the reels feed.
              </p>
            </div>

            {/* Caption Field */}
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <textarea
                id="caption"
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                placeholder="Describe your video content..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional: Add a caption to describe your video content.
              </p>
            </div>

            {/* Tags Field */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="tag1, tag2, tag3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional: Add tags separated by commas to help people discover your content.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-green-600 mb-3">{success}</p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => navigate('/dashboard/videos')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors"
                      >
                        View My Videos
                      </button>
                      <button
                        onClick={() => navigate('/reel')}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg font-medium transition-colors"
                      >
                        View Reels Page
                      </button>
                      <button
                        onClick={() => {
                          setSuccess('');
                          setFormData({ url: '', caption: '', tags: '' });
                        }}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg font-medium transition-colors"
                      >
                        Upload Another
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard/videos')}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.url.trim()}
                onClick={(e) => {
                  console.log('=== SUBMIT BUTTON CLICKED ===');
                  console.log('Button clicked event:', e);
                  console.log('Form data:', formData);
                  console.log('Loading state:', loading);
                  console.log('URL value:', formData.url.trim());
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Upload to Reels'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">💡 Tips for Better Engagement</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Keep videos short and engaging (under 60 seconds works best)</li>
          <li>• Add a compelling caption that describes what viewers will see</li>
          <li>• Use relevant tags to help people discover your content</li>
          <li>• Your video will appear at the top of the reels page when uploaded</li>
          <li>• Make sure your YouTube video is public for it to be viewable</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoUploadPage;
