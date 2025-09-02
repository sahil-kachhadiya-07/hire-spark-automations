import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export type UserRole = 'hr' | 'interviewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: Cookies.get('hrms_token') || null,
  loading: false,
};

// Mock users for demonstration
const mockUsers: Record<UserRole, User> = {
  hr: {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'hr',
    avatar: '/api/placeholder/40/40'
  },
  interviewer: {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@company.com',
    role: 'interviewer',
    avatar: '/api/placeholder/40/40'
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      
      // Set cookie
      Cookies.set('hrms_token', action.payload.token, { expires: 7 });
    },
    loginFailure: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      
      // Remove cookie
      Cookies.remove('hrms_token');
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      
      // Remove cookie
      Cookies.remove('hrms_token');
    },
    switchRole: (state, action: PayloadAction<UserRole>) => {
      const newUser = mockUsers[action.payload];
      if (newUser) {
        state.user = newUser;
        const newToken = `mock_token_${action.payload}_${Date.now()}`;
        state.token = newToken;
        Cookies.set('hrms_token', newToken, { expires: 7 });
      }
    },
    initializeAuth: (state) => {
      const token = Cookies.get('hrms_token');
      if (token) {
        // Mock authentication - in real app, validate token with API
        const roleFromToken = token.includes('hr') ? 'hr' : 'interviewer';
        state.user = mockUsers[roleFromToken];
        state.token = token;
        state.isAuthenticated = true;
      }
    }
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  switchRole,
  initializeAuth 
} = authSlice.actions;

export default authSlice.reducer;