
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, authInitialized } = useAuth();
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  useEffect(() => {
    let timer: number | undefined;
    
    if (isLoading || !authInitialized) {
      timer = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      setTimeElapsed(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading, authInitialized]);

  console.log("ProtectedRoute: auth state:", { user, isLoading, authInitialized, timeElapsed });

  // Don't make any decisions until auth is initialized
  if (!authInitialized || isLoading) {
    const longLoadingMessage = timeElapsed > 10 
      ? "Loading is taking longer than expected. You may need to refresh the page."
      : "Loading your profile...";

    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roast-500 mb-4"></div>
        <div className="text-roast-500">{longLoadingMessage}</div>
        {timeElapsed > 5 && (
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-roast-500 text-white rounded hover:bg-roast-600"
          >
            Refresh Page
          </button>
        )}
      </div>
    );
  }

  // Now that auth is initialized, check if user exists
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
