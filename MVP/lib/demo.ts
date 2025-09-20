/**
 * Demo Mode Utilities
 * Provides utilities for demo mode functionality to allow judges and reviewers
 * to quickly explore the application without authentication barriers.
 */

/**
 * Check if demo mode is enabled
 * Demo mode can be enabled via the DEMO_MODE environment variable
 */
export const isDemoMode = (): boolean => {
  return process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};

/**
 * Check if demo mode is enabled on the client side
 * Uses NEXT_PUBLIC_ prefix for client-side access
 */
export const isDemoModeClient = (): boolean => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};

/**
 * Demo user data for use in demo mode
 * Provides realistic test data without requiring authentication
 */
export const DEMO_USER = {
  id: 'demo-user-1',
  email: 'demo@locallens.app',
  role: 'BUSINESS' as const,
  businessId: 'demo-business-1',
  businessName: 'LocalLens Demo Café',
};

/**
 * Demo business data
 */
export const DEMO_BUSINESS = {
  id: 'demo-business-1',
  name: 'LocalLens Demo Café',
  category: 'RESTAURANTS' as const,
  website: 'https://demo.locallens.app',
  address: '123 Demo Street, Example City, NY 12345',
  lat: 42.4534,
  lng: -76.4735,
  ownerId: 'demo-user-1',
};

/**
 * Demo session data for NextAuth
 */
export const DEMO_SESSION = {
  user: {
    id: DEMO_USER.id,
    email: DEMO_USER.email,
    role: DEMO_USER.role,
    businessId: DEMO_USER.businessId,
    businessName: DEMO_USER.businessName,
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
};

/**
 * Demo mode configuration
 */
export const DEMO_CONFIG = {
  bannerMessage: 'Demo Mode Active - No authentication required for judges',
  bannerSubtext: 'This is a demonstration version for evaluation purposes',
  skipAuthRoutes: ['/dashboard', '/login'],
  showBanner: true,
  allowGuestAccess: true,
};
