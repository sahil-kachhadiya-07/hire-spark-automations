import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { apiService } from '@/services/api.service';
import { User, UserRole, SignUpRequest, SignInRequest } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('hrms_token') || null,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const signUpAsync = createAsyncThunk(
  'auth/signUp',
  async (signUpData: SignUpRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.signUp(signUpData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const signInAsync = createAsyncThunk(
  'auth/signIn',
  async (signInData: SignInRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.signIn(signInData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const verifyTokenAsync = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyToken();
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiService.logout();
      return true;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('hrms_token');
      Cookies.remove('hrms_token');
    },
    setAuthFromToken: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('hrms_token', action.payload.token);
      Cookies.set('hrms_token', action.payload.token, { expires: 7 });
    }
  },
  extraReducers: (builder) => {
    // Sign Up
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('hrms_token', action.payload.data.token);
        Cookies.set('hrms_token', action.payload.data.token, { expires: 7 });
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = (action.payload as { message: string })?.message || 'Sign up failed';
        localStorage.removeItem('hrms_token');
        Cookies.remove('hrms_token');
      })
      
      // Sign In
      .addCase(signInAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('hrms_token', action.payload.data.token);
        Cookies.set('hrms_token', action.payload.data.token, { expires: 7 });
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = (action.payload as { message: string })?.message || 'Sign in failed';
        localStorage.removeItem('hrms_token');
        Cookies.remove('hrms_token');
      })
      
      // Verify Token
      .addCase(verifyTokenAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTokenAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyTokenAsync.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('hrms_token');
        Cookies.remove('hrms_token');
      })
      
      // Logout
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('hrms_token');
        Cookies.remove('hrms_token');
      })
      .addCase(logoutAsync.rejected, (state) => {
        // Even if logout fails, clear local state
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('hrms_token');
        Cookies.remove('hrms_token');
      });
  },
});

export const { 
  clearError,
  clearAuth,
  setAuthFromToken
} = authSlice.actions;

export default authSlice.reducer;