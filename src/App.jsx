import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import { FilterProvider } from './context/FilterContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import MapView from './pages/MapView'
import BusinessProfilePage from './pages/BusinessProfilePage'
import TheReelPage from './pages/TheReelPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import DashboardOverview from './pages/dashboard/DashboardOverview'
import FeedPage from './pages/FeedPage'
import './App.css'


function App() {
  const [serverStatus, setServerStatus] = useState('Checking...')
  const [serverData, setServerData] = useState(null)

  useEffect(() => {
    // Test the API connection
    const testServer = async () => {
      try {
        const response = await axios.get('/api/test')
        setServerStatus('Connected ✅')
        setServerData(response.data)
      } catch (error) {
        setServerStatus('Disconnected ❌')
        console.error('Server connection error:', error)
      }
    }

    testServer()
  }, [])

  return (
    <AuthProvider>
      <FilterProvider>
        <Router>
          <div className="App">
            {/* Development Server Status Bar */}
            {import.meta.env.DEV && (
              <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-2 text-sm">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">LocalLense Dev</span>
                    <span>Server: {serverStatus}</span>
                    {serverData && (
                      <span className="text-gray-300">Port: {serverData.port}</span>
                    )}
                    
                    {/* Dev Navigation */}
                    <div className="flex space-x-2 ml-6">
                      <Link to="/" className="text-primary-400 hover:text-primary-300">Home</Link>
                      <Link to="/feed" className="text-primary-400 hover:text-primary-300">Feed</Link>

                      <Link to="/map" className="text-primary-400 hover:text-primary-300">Map</Link>
                      <Link to="/reel" className="text-primary-400 hover:text-primary-300">Reel</Link>
                      <Link to="/login" className="text-primary-400 hover:text-primary-300">Login</Link>
                      <Link to="/dashboard" className="text-primary-400 hover:text-primary-300">Dashboard</Link>
                    </div>
                  </div>
                  <div className="text-gray-300 text-xs">
                    {serverData?.timestamp && new Date(serverData.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
            
            {/* Main Application */}
            <div className={import.meta.env.DEV ? 'pt-10' : ''}>
              <Routes>
                {/* Public Routes */}
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/business/:businessId" element={<BusinessProfilePage />} />
                <Route path="/reel" element={<TheReelPage />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected Dashboard Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute requireBusiness={true}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardOverview />} />
                  <Route path="profile" element={<div className="p-6">Profile Management - Coming Soon</div>} />
                  <Route path="videos" element={<div className="p-6">Video Management - Coming Soon</div>} />
                  <Route path="analytics" element={<div className="p-6">Analytics - Coming Soon</div>} />
                  <Route path="settings" element={<div className="p-6">Settings - Coming Soon</div>} />
                </Route>
              </Routes>
            </div>
          </div>
        </Router>
      </FilterProvider>
    </AuthProvider>
  )
}

export default App