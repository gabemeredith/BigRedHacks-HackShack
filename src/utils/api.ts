import axios from "axios";

// Create axios instance with default configuration
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { 
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  timeout: 30000, // 30 second timeout
  validateStatus: (status) => status >= 200 && status < 300, // Only consider 2xx as success
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo.token) {
          config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
        }
      } catch (error) {
        console.error('Error parsing user info:', error);
        localStorage.removeItem('userInfo');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to check if response is JSON
export function isJsonResponse(resp: any) {
  const ct = resp?.headers?.["content-type"] || resp?.headers?.get?.("content-type");
  return typeof ct === "string" && ct.includes("application/json");
}

// API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

// Business API functions
export const businessApi = {
  // Get all businesses with optional filters
  getAll: async (params: { 
    category?: string; 
    lat?: number; 
    lng?: number; 
    radius?: number 
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await api.get<ApiResponse<any[]>>(`/businesses${queryParams.toString() ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Get business by ID
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/businesses/${id}`);
    return response.data;
  },

  // Create business
  create: async (businessData: {
    name: string;
    category?: string;
    address?: any;
    lat: number;
    lng: number;
    description?: string;
    hoursOfOperation?: any;
    contactInfo?: any;
    amenities?: string[];
  }) => {
    const response = await api.post<ApiResponse<any>>('/businesses', businessData);
    return response.data;
  },

  // Create review for business
  createReview: async (businessId: string, reviewData: {
    rating: number;
    comment: string;
  }) => {
    const response = await api.post<ApiResponse<any>>(`/businesses/${businessId}/reviews`, reviewData);
    return response.data;
  }
};

// Video API functions
export const videoApi = {
  // Get all videos with optional filters
  getAll: async (params: {
    lat?: number;
    lng?: number;
    radius?: number;
    category?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await api.get<ApiResponse<any[]>>(`/videos${queryParams.toString() ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Upload video
  upload: async (videoData: {
    businessId: string;
    url: string;
    title?: string;
    caption?: string;
    tags?: string[];
  }) => {
    const response = await api.post<ApiResponse<any>>('/videos', videoData);
    return response.data;
  }
};

// Dashboard API functions
export const dashboardApi = {
  // Get dashboard data
  getData: async () => {
    const response = await api.get<ApiResponse<any>>('/dashboard');
    return response.data;
  },

  // Get business videos
  getVideos: async () => {
    const response = await api.get<ApiResponse<any[]>>('/dashboard/videos');
    return response.data;
  },

  // Upload video to dashboard
  uploadVideo: async (videoData: {
    url: string;
    title?: string;
    caption?: string;
    tags?: string[];
  }) => {
    const response = await api.post<ApiResponse<any>>('/dashboard/videos', videoData);
    return response.data;
  }
};

// Auth API functions
export const authApi = {
  // Register user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    businessName?: string;
    businessCategory?: string;
    businessAddress?: string;
  }) => {
    const response = await api.post<ApiResponse<any>>('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    const response = await api.post<ApiResponse<any>>('/auth/login', credentials);
    return response.data;
  }
};

// Feed API functions (legacy support)
export const feedApi = {
  getFeed: async (params: {
    lat?: number;
    lng?: number;
    radius?: number;
    category?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await api.get<ApiResponse<any[]>>(`/feed${queryParams.toString() ? `?${queryParams}` : ''}`);
    return response.data;
  }
};

// Health check
export const healthApi = {
  check: async () => {
    const response = await api.get<ApiResponse<any>>('/health');
    return response.data;
  }
};

// Legacy upload function for backward compatibility
export async function uploadBusinessVideo(businessId: string, data: { 
  url?: string; 
  file?: File; 
  title?: string; 
  caption?: string; 
  tags?: string[];
}) {
  // For now, only support URL-based uploads
  if (!data.url) {
    throw new Error('File uploads not yet supported. Please provide a video URL.');
  }

  return await videoApi.upload({
    businessId,
    url: data.url,
    title: data.title,
    caption: data.caption,
    tags: data.tags
  });
}