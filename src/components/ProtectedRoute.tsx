
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, authInitialized } = useAuth();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if the current route is public (doesn't require authentication)
  const isPublicRoute = ['/roasters', '/roasters/'].some(path => 
    location.pathname === path || location.pathname.startsWith('/roasters/')
  );
  
  useEffect(() => {
    let timer: number | undefined;
    
    if (isLoading || !authInitialized) {
      timer = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 500); // Faster timer checks
    } else {
      setTimeElapsed(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading, authInitialized]);

  // For public routes, bypass auth check entirely
  if (isPublicRoute) {
    console.log("Public route detected, bypassing auth check");
    return <>{children}</>;
  }

  // Check auth state once it's initialized, but only for non-public routes
  useEffect(() => {
    if (!isPublicRoute && authInitialized && !isLoading && !user) {
      console.log("User not authenticated, redirecting to login");
      navigate('/login', { replace: true });
    }
  }, [authInitialized, isLoading, user, navigate, isPublicRoute]);

  // Maximum wait time reduced to prevent showing anonymous state
  const maxWaitTime = 2; // Seconds

  // Force continue after a shorter timeout if we have a user or on public routes
  if (timeElapsed >= maxWaitTime && (user || isPublicRoute)) {
    console.log("ProtectedRoute: Forcing continuation after short timeout");
    return <>{children}</>;
  }

  // Show loading state with shorter timeout
  if ((isLoading || !authInitialized) && timeElapsed < maxWaitTime) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roast-500 mb-4"></div>
        <div className="text-roast-500">Loading...</div>
      </div>
    );
  }

  // If no user and we're not loading, Navigate component will handle redirect
  if (!user && !isLoading && authInitialized && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated or it's a public route, render the content
  return <>{children}</>;
};

export default ProtectedRoute;
