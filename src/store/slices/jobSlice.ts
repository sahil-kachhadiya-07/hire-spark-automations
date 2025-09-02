import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Job {
  id: string;
  title: string;
  description: string;
  interviewer: string;
  createdAt: string;
  status: 'draft' | 'published' | 'closed';
  applications: number;
  jobPost?: {
    id: string;
    content: string;
    platforms: string[];
    publishedAt?: string;
  };
}

interface JobState {
  jobs: Job[];
  loading: boolean;
  selectedJob: Job | null;
}

// Mock initial jobs
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    description: 'We are looking for an experienced React developer to join our team.',
    interviewer: 'Michael Chen',
    createdAt: '2024-01-15T10:00:00Z',
    status: 'published',
    applications: 15,
    jobPost: {
      id: 'post-1',
      content: 'Join our innovative team as a Senior React Developer! We offer competitive salary, remote work options, and great benefits.',
      platforms: ['LinkedIn', 'Twitter'],
      publishedAt: '2024-01-15T11:00:00Z'
    }
  },
  {
    id: '2',
    title: 'Product Manager',
    description: 'Seeking a Product Manager to drive product strategy and roadmap.',
    interviewer: 'Sarah Johnson',
    createdAt: '2024-01-10T14:30:00Z',
    status: 'published',
    applications: 8,
    jobPost: {
      id: 'post-2',
      content: 'Lead product innovation as our Product Manager. Drive strategy, collaborate with teams, and shape the future of our products.',
      platforms: ['LinkedIn'],
      publishedAt: '2024-01-10T15:00:00Z'
    }
  },
  {
    id: '3',
    title: 'UX Designer',
    description: 'Creative UX Designer needed to enhance user experience across our platforms.',
    interviewer: 'Michael Chen',
    createdAt: '2024-01-05T09:15:00Z',
    status: 'draft',
    applications: 0
  }
];

const initialState: JobState = {
  jobs: mockJobs,
  loading: false,
  selectedJob: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addJob: (state, action: PayloadAction<Omit<Job, 'id' | 'createdAt' | 'applications' | 'status'>>) => {
      const newJob: Job = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        applications: 0,
        status: 'draft'
      };
      state.jobs.unshift(newJob);
    },
    updateJob: (state, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex(job => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter(job => job.id !== action.payload);
    },
    setSelectedJob: (state, action: PayloadAction<Job | null>) => {
      state.selectedJob = action.payload;
    },
    generateJobPost: (state, action: PayloadAction<{ jobId: string; content: string }>) => {
      const job = state.jobs.find(j => j.id === action.payload.jobId);
      if (job) {
        job.jobPost = {
          id: `post-${Date.now()}`,
          content: action.payload.content,
          platforms: [],
          publishedAt: undefined
        };
      }
    },
    publishJobPost: (state, action: PayloadAction<{ jobId: string; platforms: string[] }>) => {
      const job = state.jobs.find(j => j.id === action.payload.jobId);
      if (job && job.jobPost) {
        job.jobPost.platforms = action.payload.platforms;
        job.jobPost.publishedAt = new Date().toISOString();
        job.status = 'published';
      }
    }
  },
});

export const {
  setLoading,
  addJob,
  updateJob,
  deleteJob,
  setSelectedJob,
  generateJobPost,
  publishJobPost
} = jobSlice.actions;

export default jobSlice.reducer;