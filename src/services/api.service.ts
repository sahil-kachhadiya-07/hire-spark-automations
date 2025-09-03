import axios from 'axios';
import {
  SignUpRequest,
  SignInRequest,
  AuthResponse,
  ProfileResponse,
  VerifyTokenResponse,
  LogoutResponse,
  ApiErrorResponse
} from '@/types/auth.types';
import { Job } from '@/store/slices/jobSlice';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management functions
const getToken = (): string | null => {
  return localStorage.getItem('hrms_token') || null;
};

const setToken = (token: string): void => {
  localStorage.setItem('hrms_token', token);
};

const clearToken = (): void => {
  localStorage.removeItem('hrms_token');
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Error handling function
const handleError = (error: any): ApiErrorResponse => {
  if (error.response?.data) {
    // API returned an error response
    return error.response.data;
  } else if (error.request) {
    // Network error
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  } else {
    // Other error
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
};

// Authentication functions
export const signUp = async (data: SignUpRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/api/auth/signup', data);
    
    if (response.data.success && response.data.data.token) {
      setToken(response.data.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const signIn = async (data: SignInRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/api/auth/signin', data);
    
    if (response.data.success && response.data.data.token) {
      setToken(response.data.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await api.get<ProfileResponse>('/api/auth/profile');
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const verifyToken = async (): Promise<VerifyTokenResponse> => {
  try {
    const response = await api.get<VerifyTokenResponse>('/api/auth/verify');
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await api.post<LogoutResponse>('/api/auth/logout');
    clearToken();
    return response.data;
  } catch (error: any) {
    clearToken();
    throw handleError(error);
  }
};

// Health check
export const healthCheck = async (): Promise<{ success: boolean; message: string; timestamp: string }> => {
  try {
    const response = await api.get<{ success: boolean; message: string; timestamp: string }>('/api/health');
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Utility functions
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    // Basic JWT token validation (check if it's not expired)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

export const getCurrentToken = (): string | null => {
  return getToken();
};

export const clearAuthData = (): void => {
  clearToken();
};

// Get interviewers
export const getInterviewers = async (): Promise<{ success: boolean; message: string; data: { id: string; username: string; email: string }[] }> => {
  try {
    const response = await api.get<{ success: boolean; message: string; data: { id: string; username: string; email: string }[] }>('/api/auth/interviewers');
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// LinkedIn OAuth API functions
export const startLinkedInAuth = async (): Promise<{ success: boolean; authUrl: string; message: string }> => {
  try {
    const response = await api.get<{ success: boolean; authUrl: string; message: string }>('/api/auth/linkedin/auth');
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const getLinkedInStatus = async (): Promise<{ 
  success: boolean; 
  message: string; 
  data: { 
    isConnected: boolean; 
    linkedinEmail: string | null; 
    lastConnected: string | null; 
    tokenValid: boolean;
    profile?: {
      firstName?: string;
      lastName?: string;
      profilePicture?: string;
    }
  } 
}> => {
  try {
    const response = await api.get('/api/auth/linkedin/status');
    return response.data as { 
      success: boolean; 
      message: string; 
      data: { isConnected: boolean; linkedinEmail: string | null; lastConnected: string | null; tokenValid: boolean; profile?: { firstName?: string; lastName?: string; profilePicture?: string; } } 
    };
  } catch (error: any) {
    throw handleError(error);
  }
};

export const disconnectLinkedIn = async (): Promise<{ success: boolean; message: string; data: any }> => {
  try {
    const response = await api.delete<{ success: boolean; message: string; data: any }>('/api/auth/linkedin/disconnect');
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Job API types
export interface CreateJobRequest {
  title: string;
  description: string;
  interviewer: string;
}

export interface JobResponse {
  success: boolean;
  message: string;
  data: Job;
}

export interface JobListResponse {
  success: boolean;
  message: string;
  data: Job[];
}

export interface JobStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    published: number;
    draft: number;
    closed: number;
    totalApplications: number;
  };
}

export interface GenerateJobPostRequest {
  content?: string;
  useAI?: boolean;
  includeImage?: boolean;
  companyInfo?: string;
}

export interface PublishJobPostRequest {
  platforms: string[];
  content?: string;
}

// Job API functions
export const createJob = async (data: CreateJobRequest): Promise<JobResponse> => {
  try {
    const response = await api.post<JobResponse>('/api/jobs', data);
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const getJobs = async (status?: string): Promise<JobListResponse> => {
  try {
    const params = status ? { status } : {};
    const response = await api.get<JobListResponse>('/api/jobs', { params });
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const getJobById = async (id: string): Promise<JobResponse> => {
  try {
    const response = await api.get<JobResponse>(`/api/jobs/${id}`);
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const updateJob = async (id: string, data: Partial<CreateJobRequest>): Promise<JobResponse> => {
  try {
    const response = await api.put<JobResponse>(`/api/jobs/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const deleteJob = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message: string }>(`/api/jobs/${id}`);
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const generateJobPost = async (id: string, data: GenerateJobPostRequest): Promise<JobResponse> => {
  try {
    const response = await api.post<JobResponse>(`/api/jobs/${id}/job-post`, data);
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const publishJobPost = async (id: string, data: PublishJobPostRequest): Promise<any> => {
  try {
    const response = await api.post(`/api/jobs/${id}/publish`, { 
      platforms: data.platforms,
      content: data.content
    });
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const incrementApplications = async (id: string): Promise<{ success: boolean; message: string; data: { id: string; applications: number } }> => {
  try {
    const response = await api.post<{ success: boolean; message: string; data: { id: string; applications: number } }>(`/api/jobs/${id}/applications`);
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const getJobStats = async (): Promise<JobStatsResponse> => {
  try {
    const response = await api.get<JobStatsResponse>('/api/jobs/stats');
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Default export object for backward compatibility
const apiService = {
  signUp,
  signIn,
  getProfile,
  verifyToken,
  logout,
  healthCheck,
  isTokenValid,
  getCurrentToken,
  clearAuthData,
  getInterviewers,
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  generateJobPost,
  publishJobPost,
  incrementApplications,
  getJobStats
};

export { apiService };
export default apiService;