
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/context/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, authInitialized } = useAuth();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // Check if the current route is public (doesn't require authentication)
  const isPublicRoute = [
    '/roasters', 
    '/roasters/'
  ].some(path => 
    location.pathname === path || location.pathname.startsWith('/roasters/')
  );
  
  // Check if this is a username profile route
  const isUsernameRoute = location.pathname.split('/').length === 2 && 
                          location.pathname !== '/profile' && 
                          location.pathname !== '/login' && 
                          location.pathname !== '/signup' &&
                          !location.pathname.startsWith('/roasters/') &&
                          !location.pathname.startsWith('/coffee/');
  
  console.log("ProtectedRoute check:", { 
    path: location.pathname, 
    isPublicRoute, 
    isUsernameRoute,
    params
  });
  
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

  // For public routes or username routes, bypass auth check entirely
  if (isPublicRoute || isUsernameRoute) {
    console.log("Public or username route detected, bypassing auth check");
    return <>{children}</>;
  }

  // Check auth state once it's initialized, but only for routes requiring auth
  useEffect(() => {
    if (!isPublicRoute && !isUsernameRoute && authInitialized && !isLoading && !user) {
      console.log("User not authenticated, redirecting to login");
      navigate('/login', { replace: true });
    }
  }, [authInitialized, isLoading, user, navigate, isPublicRoute, isUsernameRoute]);

  // Maximum wait time reduced to prevent showing anonymous state
  const maxWaitTime = 2; // Seconds

  // Force continue after a shorter timeout if we have a user or on public routes
  if (timeElapsed >= maxWaitTime && (user || isPublicRoute || isUsernameRoute)) {
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
  if (!user && !isLoading && authInitialized && !isPublicRoute && !isUsernameRoute) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated or it's a public or username route, render the content
  return <>{children}</>;
};

export default ProtectedRoute;
