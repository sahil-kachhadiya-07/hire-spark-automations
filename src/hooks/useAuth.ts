import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { 
  signUpAsync, 
  signInAsync, 
  verifyTokenAsync, 
  logoutAsync, 
  clearError, 
  clearAuth 
} from '@/store/slices/authSlice';
import { UserRole, SignUpRequest, SignInRequest } from '@/types/auth.types';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, token, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Initialize auth by verifying existing token
    if (token && !user) {
      dispatch(verifyTokenAsync());
    }
  }, [dispatch, token, user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const signInData: SignInRequest = { email, password };
      const result = await dispatch(signInAsync(signInData));
      return signInAsync.fulfilled.match(result);
    } catch (error) {
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const signUpData: SignUpRequest = { username, email, password, role };
      const result = await dispatch(signUpAsync(signUpData));
      return signUpAsync.fulfilled.match(result);
    } catch (error) {
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await dispatch(logoutAsync());
    } catch (error) {
      // Even if API call fails, clear local state
      dispatch(clearAuth());
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const verifyToken = async (): Promise<boolean> => {
    try {
      const result = await dispatch(verifyTokenAsync());
      return verifyTokenAsync.fulfilled.match(result);
    } catch (error) {
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    clearError: clearAuthError,
    verifyToken
  };
};