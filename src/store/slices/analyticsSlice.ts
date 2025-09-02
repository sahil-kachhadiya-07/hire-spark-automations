import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Resume {
  id: string;
  candidateName: string;
  email: string;
  jobId: string;
  jobTitle: string;
  source: 'linkedin' | 'email' | 'website';
  receivedAt: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  score?: number;
  resumeUrl: string;
}

export interface SocialMetrics {
  platform: string;
  impressions: number;
  clicks: number;
  applications: number;
}

export interface AnalyticsData {
  totalJobs: number;
  totalApplications: number;
  activeJobPosts: number;
  shortlistedCandidates: number;
  socialMetrics: SocialMetrics[];
  recentResumes: Resume[];
}

interface AnalyticsState {
  data: AnalyticsData;
  loading: boolean;
}

// Mock analytics data
const mockResumes: Resume[] = [
  {
    id: '1',
    candidateName: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    jobId: '1',
    jobTitle: 'Senior React Developer',
    source: 'linkedin',
    receivedAt: '2024-01-15T14:30:00Z',
    status: 'shortlisted',
    score: 85,
    resumeUrl: '/mock-resume-1.pdf'
  },
  {
    id: '2',
    candidateName: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    jobId: '1',
    jobTitle: 'Senior React Developer',
    source: 'email',
    receivedAt: '2024-01-15T12:15:00Z',
    status: 'reviewed',
    score: 78,
    resumeUrl: '/mock-resume-2.pdf'
  },
  {
    id: '3',
    candidateName: 'David Kim',
    email: 'david.kim@email.com',
    jobId: '2',
    jobTitle: 'Product Manager',
    source: 'website',
    receivedAt: '2024-01-14T16:45:00Z',
    status: 'pending',
    resumeUrl: '/mock-resume-3.pdf'
  },
  {
    id: '4',
    candidateName: 'Jennifer Liu',
    email: 'jennifer.liu@email.com',
    jobId: '1',
    jobTitle: 'Senior React Developer',
    source: 'linkedin',
    receivedAt: '2024-01-14T11:20:00Z',
    status: 'shortlisted',
    score: 92,
    resumeUrl: '/mock-resume-4.pdf'
  }
];

const mockSocialMetrics: SocialMetrics[] = [
  { platform: 'LinkedIn', impressions: 12450, clicks: 340, applications: 15 },
  { platform: 'Twitter', impressions: 5680, clicks: 120, applications: 5 },
  { platform: 'Facebook', impressions: 3200, clicks: 85, applications: 3 },
  { platform: 'Indeed', impressions: 8900, clicks: 230, applications: 12 }
];

const initialState: AnalyticsState = {
  data: {
    totalJobs: 3,
    totalApplications: 23,
    activeJobPosts: 2,
    shortlistedCandidates: 6,
    socialMetrics: mockSocialMetrics,
    recentResumes: mockResumes
  },
  loading: false
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateMetrics: (state, action: PayloadAction<Partial<AnalyticsData>>) => {
      state.data = { ...state.data, ...action.payload };
    },
    addResume: (state, action: PayloadAction<Resume>) => {
      state.data.recentResumes.unshift(action.payload);
      state.data.totalApplications += 1;
    },
    updateResumeStatus: (state, action: PayloadAction<{ id: string; status: Resume['status']; score?: number }>) => {
      const resume = state.data.recentResumes.find(r => r.id === action.payload.id);
      if (resume) {
        resume.status = action.payload.status;
        if (action.payload.score) {
          resume.score = action.payload.score;
        }
        if (action.payload.status === 'shortlisted') {
          state.data.shortlistedCandidates += 1;
        }
      }
    }
  }
});

export const {
  setLoading,
  updateMetrics,
  addResume,
  updateResumeStatus
} = analyticsSlice.actions;

export default analyticsSlice.reducer;