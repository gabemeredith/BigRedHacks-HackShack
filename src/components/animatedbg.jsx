// AnimatedBackground.jsx
import React from 'react';

const AnimatedBackground = ({ 
  variant = 'default', 
  intensity = 'medium',
  className = '' 
}) => {
  const variants = {
    default: 'from-purple-900 via-blue-900 to-indigo-900',
    hero: 'from-purple-900 via-blue-900 to-indigo-900',
    feed: 'from-slate-900 via-purple-900 to-indigo-900',
    dark: 'from-gray-900 via-slate-900 to-black',
    gradient: 'from-violet-900 via-purple-900 to-fuchsia-900'
  };

  const intensitySettings = {
    low: {
      overlay: 'from-purple-600/10 via-blue-600/5 to-indigo-600/10',
      elements: [
        { size: 'w-24 h-24', opacity: 'opacity-10', duration: '2.5s', delay: '0s' },
        { size: 'w-32 h-32', opacity: 'opacity-8', duration: '3s', delay: '0.5s' },
        { size: 'w-20 h-20', opacity: 'opacity-12', duration: '2.8s', delay: '1s' }
      ]
    },
    medium: {
      overlay: 'from-purple-600/30 via-blue-600/20 to-indigo-600/30',
      elements: [
        { size: 'w-32 h-32', opacity: 'opacity-20', duration: '1.5s', delay: '0s' },
        { size: 'w-48 h-48', opacity: 'opacity-20', duration: '2s', delay: '0.3s' },
        { size: 'w-24 h-24', opacity: 'opacity-20', duration: '1.8s', delay: '0.7s' },
        { size: 'w-20 h-20', opacity: 'opacity-15', duration: '2.2s', delay: '1s' },
        { size: 'w-28 h-28', opacity: 'opacity-18', duration: '1.7s', delay: '0.5s' }
      ]
    },
    high: {
      overlay: 'from-purple-600/40 via-blue-600/30 to-indigo-600/40',
      elements: [
        { size: 'w-40 h-40', opacity: 'opacity-30', duration: '1.2s', delay: '0s' },
        { size: 'w-56 h-56', opacity: 'opacity-25', duration: '1.5s', delay: '0.2s' },
        { size: 'w-32 h-32', opacity: 'opacity-28', duration: '1.3s', delay: '0.5s' },
        { size: 'w-24 h-24', opacity: 'opacity-20', duration: '1.8s', delay: '0.8s' },
        { size: 'w-36 h-36', opacity: 'opacity-25', duration: '1.4s', delay: '0.3s' }
      ]
    }
  };

  const settings = intensitySettings[intensity];

  return (
    <>
      {/* Base Background */}
      <div className={`fixed inset-0 bg-gradient-to-br ${variants[variant]} -z-20`}></div>
      
      {/* Overlay Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${settings.overlay}`}></div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4">
        <div className={`${settings.elements[0]?.size} bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-3xl ${settings.elements[0]?.opacity} animate-pulse`} 
             style={{animationDuration: settings.elements[0]?.duration, animationDelay: settings.elements[0]?.delay}}></div>
      </div>
      
      <div className="absolute top-3/4 right-1/4">
        <div className={`${settings.elements[1]?.size} bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur-3xl ${settings.elements[1]?.opacity} animate-pulse`}
             style={{animationDuration: settings.elements[1]?.duration, animationDelay: settings.elements[1]?.delay}}></div>
      </div>
      
      <div className="absolute top-1/2 left-3/4">
        <div className={`${settings.elements[2]?.size} bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl ${settings.elements[2]?.opacity} animate-pulse`}
             style={{animationDuration: settings.elements[2]?.duration, animationDelay: settings.elements[2]?.delay}}></div>
      </div>

      {settings.elements[3] && (
        <div className="absolute top-1/3 right-1/3">
          <div className={`${settings.elements[3].size} bg-gradient-to-r from-green-400 to-teal-500 rounded-full blur-3xl ${settings.elements[3].opacity} animate-pulse`}
               style={{animationDuration: settings.elements[3].duration, animationDelay: settings.elements[3].delay}}></div>
        </div>
      )}

      {settings.elements[4] && (
        <div className="absolute bottom-1/4 left-1/3">
          <div className={`${settings.elements[4].size} bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-3xl ${settings.elements[4].opacity} animate-pulse`}
               style={{animationDuration: settings.elements[4].duration, animationDelay: settings.elements[4].delay}}></div>
        </div>
      )}
    </>
  );
};

export default AnimatedBackground;