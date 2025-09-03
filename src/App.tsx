import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignUpForm';
import DashboardLayout from '@/components/DashboardLayout';
import JobManagementDashboard from '@/components/JobManagementDashboard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import MultiUserDashboard from '@/components/MultiUserDashboard';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// App Routes Component
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? (
          <ProtectedRoute>
            <DashboardLayout title="Dashboard Overview" subtitle="Welcome to your HRMS dashboard">
              <MultiUserDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="/jobs" element={
        <ProtectedRoute>
          <DashboardLayout title="Job Management" subtitle="Create and manage your job postings">
            <JobManagementDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedRoute>
          <DashboardLayout title="Analytics & Reports" subtitle="Track your recruitment metrics and performance">
            <AnalyticsDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />
      } />
      
      <Route path="/signup" element={
        isAuthenticated ? <Navigate to="/" replace /> : <SignupForm />
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
