import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '@/services/api.service';

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
    imageUrl?: string;
  };
  ai_metadata?: {
    ai_generated?: boolean;
    model_used?: string;
    tokens_used?: number;
    generatedAt?: string;
    imagePrompt?: string;
  };
  publishResults?: Array<{
    platform: string;
    success: boolean;
    message: string;
    postedAt?: Date;
  }>;
}

interface JobState {
  jobs: Job[];
  loading: boolean;
  selectedJob: Job | null;
  error: string | null;
}

// Async thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (status?: string) => {
    const response = await api.getJobs(status);
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  }
);

export const createJobAsync = createAsyncThunk(
  'jobs/createJob',
  async (jobData: api.CreateJobRequest) => {
    const response = await api.createJob(jobData);
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  }
);

export const updateJobAsync = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, data }: { id: string; data: Partial<api.CreateJobRequest> }) => {
    const response = await api.updateJob(id, data);
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  }
);

export const deleteJobAsync = createAsyncThunk(
  'jobs/deleteJob',
  async (id: string) => {
    const response = await api.deleteJob(id);
    if (!response.success) {
      throw new Error(response.message);
    }
    return id;
  }
);

export const generateJobPostAsync = createAsyncThunk(
  'jobs/generateJobPost',
  async ({ id, content }: { id: string; content: string }) => {
    const response = await api.generateJobPost(id, { content });
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  }
);

export const publishJobPostAsync = createAsyncThunk(
  'jobs/publishJobPost',
  async ({ id, platforms }: { id: string; platforms: string[] }) => {
    const response = await api.publishJobPost(id, { platforms });
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  }
);

const initialState: JobState = {
  jobs: [],
  loading: false,
  selectedJob: null,
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSelectedJob: (state, action: PayloadAction<Job | null>) => {
      state.selectedJob = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch jobs';
      })
      
      // Create Job
      .addCase(createJobAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
        state.error = null;
      })
      .addCase(createJobAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create job';
      })
      
      // Update Job
      .addCase(updateJobAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateJobAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update job';
      })
      
      // Delete Job
      .addCase(deleteJobAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJobAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(job => job.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteJobAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete job';
      })
      
      // Generate Job Post
      .addCase(generateJobPostAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateJobPostAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(generateJobPostAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate job post';
      })
      
      // Publish Job Post
      .addCase(publishJobPostAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishJobPostAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(publishJobPostAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to publish job post';
      });
  },
});

export const {
  setSelectedJob,
  clearError
} = jobSlice.actions;

export default jobSlice.reducer;