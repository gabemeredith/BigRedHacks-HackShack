import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Menu, X, Home, Map, Play, Grid3X3, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UnifiedHeader = ({ 
  currentPage = 'home',
  variant = 'default', // 'default', 'reel' (auto-hide), 'transparent'
  className = ''
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userInfo, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { id: 'home', label: 'Home', path: '/', icon: Home },
    { id: 'feed', label: 'Feed', path: '/feed', icon: Grid3X3 },
    { id: 'reel', label: 'Reels', path: '/reel', icon: Play },
    { id: 'map', label: 'Map', path: '/map', icon: Map }
  ];

  const baseHeaderClasses = "fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-white/10";
  
  const variantClasses = {
    default: '',
    transparent: 'bg-gradient-to-b from-black/80 via-black/40 to-transparent',
    reel: 'transition-all duration-300'
  };

  return (
    <header className={`${baseHeaderClasses} ${variantClasses[variant]} ${className}`}>
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-200">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-slate-900">
                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              </div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
              LocalLens
            </span>
          </div>

          {/* Desktop Navigation - Responsive Layout */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center max-w-md mx-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-2">
              {loading ? (
                <div className="text-white/60 text-sm">Loading...</div>
              ) : userInfo ? (
                // Authenticated user actions
                <>
                  <div className="flex items-center gap-2 text-white max-w-32">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium text-sm truncate">
                      {userInfo.user.businessName || userInfo.user.name || userInfo.user.email}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="relative group bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 transform backdrop-blur-sm border border-white/20 hover:shadow-lg hover:shadow-violet-500/25"
                  >
                    <span className="relative z-10 text-sm">Dashboard</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/dashboard/videos/upload')}
                    className="relative group overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-2xl hover:shadow-purple-500/50"
                  >
                    <span className="relative z-10 flex items-center gap-1 text-sm">
                      <Video className="w-4 h-4" />
                      <span className="hidden xl:inline">Upload</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                // Non-authenticated guest users
                <>
                  <button 
                    onClick={() => navigate('/login')}
                    className="relative group bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 transform backdrop-blur-sm border border-white/20 hover:shadow-lg hover:shadow-violet-500/25"
                  >
                    <span className="relative z-10 text-sm">Login</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/register')}
                    className="relative group overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-2xl hover:shadow-purple-500/50"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-sm">
                      <Video className="w-4 h-4" />
                      <span className="hidden xl:inline">List Business</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </>
              )}
            </div>

            {/* Medium screens - show abbreviated actions */}
            <div className="hidden md:lg:hidden flex items-center gap-2">
              {userInfo ? (
                <>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Dashboard"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10">
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10 mt-4">
              {loading ? (
                <div className="text-white/60 text-sm text-center py-4">Loading...</div>
              ) : userInfo ? (
                // Authenticated mobile actions
                <>
                  <div className="text-center text-white font-medium px-6 py-2">
                    Welcome, {userInfo.user.businessName || userInfo.user.name || userInfo.user.email}
                  </div>
                  <button 
                    onClick={() => {navigate('/dashboard'); setMobileMenuOpen(false);}}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-center"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => {navigate('/dashboard/videos/upload'); setMobileMenuOpen(false);}}
                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Upload Video
                  </button>
                  <button 
                    onClick={() => {handleLogout(); setMobileMenuOpen(false);}}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-center flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                // Non-authenticated mobile guest actions
                <>
                  <button 
                    onClick={() => {navigate('/login'); setMobileMenuOpen(false);}}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-center"
                  >
                    Business Login
                  </button>
                  <button 
                    onClick={() => {navigate('/register'); setMobileMenuOpen(false);}}
                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    List Your Business
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default UnifiedHeader;
