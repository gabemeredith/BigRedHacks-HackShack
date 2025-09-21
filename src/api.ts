// src/api.ts - Updated to work with new backend
import axios from 'axios';

// Feed item type
export type FeedItem = {
  _id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  title?: string;
  tags?: string[];
  business?: { 
    _id: string; 
    name: string; 
    category?: string; 
    location?: { 
      type: 'Point'; 
      coordinates?: [number, number] 
    } 
  };
  createdAt: string;
  views?: number;
  likes?: number;
};

// Business type
export type Business = {
  _id: string;
  name: string;
  category?: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  videos?: FeedItem[];
  reviews?: Review[];
  hoursOfOperation?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  contactInfo?: {
    phoneNumber?: string;
    website?: string;
    email?: string;
  };
  amenities?: string[];
  coverImage?: string;
  priceLevel?: string;
  averageRating?: number;
};

// Review type
export type Review = {
  _id: string;
  rating: number;
  comment: string;
  business: string;
  createdAt: string;
};

// API Response type
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
};

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (error) {
      console.error('Error parsing user info:', error);
      localStorage.removeItem('userInfo');
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Feed API
export async function getFeed(params: { 
  lat?: number; 
  lng?: number; 
  r?: number; 
  category?: string 
} = {}): Promise<FeedItem[]> {
  try {
    const queryParams = new URLSearchParams();
    
    // Map 'r' to 'radius' for backend
    if (params.r !== undefined) {
      queryParams.append('radius', params.r.toString());
    }
    if (params.lat !== undefined) {
      queryParams.append('lat', params.lat.toString());
    }
    if (params.lng !== undefined) {
      queryParams.append('lng', params.lng.toString());
    }
    if (params.category) {
      queryParams.append('category', params.category);
    }

    const response = await api.get<ApiResponse<FeedItem[]>>(`/feed${queryParams.toString() ? `?${queryParams}` : ''}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch feed');
    }
  } catch (error) {
    console.error('Error fetching feed:', error);
    throw error;
  }
}

// Business API
export async function getBusinesses(params: {
  category?: string;
  lat?: number;
  lng?: number;
  radius?: number;
} = {}): Promise<Business[]> {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get<ApiResponse<Business[]>>(`/businesses${queryParams.toString() ? `?${queryParams}` : ''}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch businesses');
    }
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
}

export async function getBusinessById(id: string): Promise<Business> {
  try {
    const response = await api.get<ApiResponse<Business>>(`/businesses/${id}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Business not found');
    }
  } catch (error) {
    console.error('Error fetching business:', error);
    throw error;
  }
}

// Video API
export async function getVideos(params: {
  lat?: number;
  lng?: number;
  radius?: number;
  category?: string;
} = {}): Promise<FeedItem[]> {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get<ApiResponse<FeedItem[]>>(`/videos${queryParams.toString() ? `?${queryParams}` : ''}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch videos');
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

export async function uploadVideo(videoData: {
  businessId?: string;
  url: string;
  title?: string;
  caption?: string;
  tags?: string[];
}): Promise<FeedItem> {
  try {
    const response = await api.post<ApiResponse<FeedItem>>('/videos', videoData);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to upload video');
    }
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}

// Dashboard API
export async function getDashboardData(): Promise<any> {
  try {
    const response = await api.get<ApiResponse<any>>('/dashboard');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch dashboard data');
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

export async function getDashboardVideos(): Promise<FeedItem[]> {
  try {
    const response = await api.get<ApiResponse<FeedItem[]>>('/dashboard/videos');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch dashboard videos');
    }
  } catch (error) {
    console.error('Error fetching dashboard videos:', error);
    throw error;
  }
}

export async function uploadDashboardVideo(videoData: {
  url: string;
  title?: string;
  caption?: string;
  tags?: string[];
}): Promise<FeedItem> {
  try {
    const response = await api.post<ApiResponse<FeedItem>>('/dashboard/videos', videoData);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to upload video');
    }
  } catch (error) {
    console.error('Error uploading dashboard video:', error);
    throw error;
  }
}

// Auth API
export async function register(userData: {
  name: string;
  email: string;
  password: string;
  businessName?: string;
  businessCategory?: string;
  businessAddress?: string;
}): Promise<{ user: any; token: string }> {
  try {
    const response = await api.post<ApiResponse<{ user: any; token: string }>>('/auth/register', userData);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function login(credentials: {
  email: string;
  password: string;
}): Promise<{ user: any; token: string }> {
  try {
    const response = await api.post<ApiResponse<{ user: any; token: string }>>('/auth/login', credentials);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// Review API
export async function createReview(businessId: string, reviewData: {
  rating: number;
  comment: string;
}): Promise<Review> {
  try {
    const response = await api.post<ApiResponse<Review>>(`/businesses/${businessId}/reviews`, reviewData);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create review');
    }
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

// Health check
export async function healthCheck(): Promise<any> {
  try {
    const response = await api.get<ApiResponse<any>>('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}