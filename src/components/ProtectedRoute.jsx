import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requireBusiness = false }) => {
  const { userInfo, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if business access is required 
  // Since we now only allow business registration, all registered users are businesses
  if (requireBusiness && userInfo.user?.role !== 'business_owner' && !userInfo.user?.businessName && !userInfo.user?.business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Access Required</h1>
          <p className="text-gray-600 mb-6">
            You need to register as a business to access this area.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/register'}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Register Your Business
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the protected component
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireBusiness: PropTypes.bool
};

export default ProtectedRoute;
