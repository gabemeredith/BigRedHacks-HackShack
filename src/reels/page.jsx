import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReelsFeed from "./components/ReelsFeed";

function ReelsPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Use hardcoded video data for hackathon demo (inverted order)
    const hardcodedVideos = [
      {
        id: '5',
        title: 'Featured Local Content',
        url: 'https://youtu.be/4qGXBlszbTY',
        businessName: 'Local Business Hub',
        distanceMi: 0.5,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Local Business Highlight',
        url: 'https://www.youtube.com/watch?v=G6BZjXiLg8g',
        businessName: 'Local Business Hub',
        distanceMi: 0.5,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Community Business Feature',
        url: 'https://www.youtube.com/watch?v=SDMi6jeIwy4',
        businessName: 'Local Business Hub',
        distanceMi: 0.5,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Local Business Showcase',
        url: 'https://www.youtube.com/watch?v=Z6Dx-o3vfJY',
        businessName: 'Local Business Hub',
        distanceMi: 0.5,
        createdAt: new Date().toISOString()
      },
      {
        id: '1',
        title: 'Amazing Local Business Content',
        url: 'https://www.youtube.com/watch?v=Qb4zV2oFYyE',
        businessName: 'Local Business Hub',
        distanceMi: 0.5,
        createdAt: new Date().toISOString()
      }
    ];

    // Simulate loading time for better UX
    setTimeout(() => {
      setVideos(hardcodedVideos);
      setLoading(false);
    }, 1000);
  }, []);
  
  if (loading) {
    return (
      <main className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-10a9 9 0 100 18 9 9 0 000-18z" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl animate-pulse opacity-50"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">Loading Reels...</h2>
          <p className="text-gray-400">Discovering amazing local content</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Custom Header for Reels */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 transform hover:scale-105 backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-lg hover:shadow-violet-500/25"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </button>
            
            {/* Page Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                Local Reels
              </h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Reels Feed with top padding to account for header */}
      <div className="pt-20 h-[calc(100vh-5rem)]">
        {videos.length > 0 ? (
          <ReelsFeed videos={videos} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/50">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">No Videos Yet</h2>
              <p className="text-gray-400">Check back soon for amazing local content!</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ReelsPage;
