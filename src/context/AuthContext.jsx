import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// Create the context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing user info in localStorage on app start
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const parsed = JSON.parse(storedUserInfo);
        
        // Validate token format
        if (parsed.token && parsed.user) {
          setUserInfo(parsed);
          
          // Set axios default header for authenticated requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
        } else {
          localStorage.removeItem('userInfo');
        }
      } catch (err) {
        console.error('Error parsing stored user info:', err);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  // Add axios interceptor to handle 401 responses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/auth/register', userData);
      
      const { user, token } = response.data.data;
      const userInfoData = { user, token };

      setUserInfo(userInfoData);
      localStorage.setItem('userInfo', JSON.stringify(userInfoData));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, data: userInfoData };

    } catch (err) {
      let errorMessage = 'Registration failed';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please make sure the server is running.';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Server connection refused. Please check if the backend is running.';
      } else {
        errorMessage = err.message || 'Registration failed';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { user, token } = response.data.data;
      const userInfoData = { user, token };

      setUserInfo(userInfoData);
      localStorage.setItem('userInfo', JSON.stringify(userInfoData));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, data: userInfoData };

    } catch (err) {
      let errorMessage = 'Login failed';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please make sure the server is running.';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Server connection refused. Please check if the backend is running.';
      } else {
        errorMessage = err.message || 'Login failed';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUserInfo(null);
    setError(null);
    localStorage.removeItem('userInfo');
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put('/api/auth/profile', profileData);
      
      const updatedUser = response.data.data;
      const updatedUserInfo = { ...userInfo, user: updatedUser };

      setUserInfo(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

      return { success: true, data: updatedUser };

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put('/api/auth/password', {
        currentPassword,
        newPassword
      });

      return { success: true, message: response.data.message };

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Password change failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get current user profile
  const getCurrentUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      const updatedUser = response.data.data;
      
      const updatedUserInfo = { ...userInfo, user: updatedUser };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

      return { success: true, data: updatedUser };

    } catch (err) {
      // If token is invalid, logout user
      if (err.response?.status === 401) {
        logout();
      }
      return { success: false, error: err.response?.data?.message || 'Failed to fetch user' };
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value = {
    userInfo,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    getCurrentUser,
    clearError,
    isAuthenticated: !!userInfo,
    hasBusinessAccess: !!userInfo // Since all registered users are now businesses
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
