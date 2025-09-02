import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { loginStart, loginSuccess, loginFailure, logout, switchRole, initializeAuth, UserRole, User } from '@/store/slices/authSlice';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, token, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch(loginStart());
    
    try {
      // Mock login - in real app, make API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple mock validation
      if (email && password) {
        const role: UserRole = email.includes('hr') ? 'hr' : 'interviewer';
        
        const mockUser: User = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          role
        };
        
        const mockToken = `mock_token_${role}_${Date.now()}`;
        
        dispatch(loginSuccess({ user: mockUser, token: mockToken }));
        return true;
      } else {
        dispatch(loginFailure());
        return false;
      }
    } catch (error) {
      dispatch(loginFailure());
      return false;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSwitchRole = (role: UserRole) => {
    dispatch(switchRole(role));
  };

  return {
    user,
    isAuthenticated,
    token,
    loading,
    login,
    logout: handleLogout,
    switchRole: handleSwitchRole
  };
};