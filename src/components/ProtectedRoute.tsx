
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, authInitialized } = useAuth();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    let timer: number | undefined;
    
    if (isLoading || !authInitialized) {
      timer = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 500); // Faster timer checks (500ms instead of 1000ms)
    } else {
      setTimeElapsed(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading, authInitialized]);

  // Check auth state once it's initialized
  useEffect(() => {
    if (authInitialized && !isLoading && !user) {
      console.log("User not authenticated, redirecting to login");
      navigate('/login', { replace: true });
    }
  }, [authInitialized, isLoading, user, navigate]);

  // Force continue after a shorter timeout if we have a user
  if (timeElapsed >= 2 && user) {
    console.log("ProtectedRoute: Forcing continuation after short timeout with existing user");
    return <>{children}</>;
  }

  // Show loading state with shorter timeout
  if ((isLoading || !authInitialized) && timeElapsed < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roast-500 mb-4"></div>
        <div className="text-roast-500">Loading your profile...</div>
      </div>
    );
  }

  // If no user and we're not loading, Navigate component will handle redirect
  if (!user && !isLoading && authInitialized) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
