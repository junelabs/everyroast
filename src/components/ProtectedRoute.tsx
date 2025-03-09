
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Add a timer to track how long loading has been happening
  useEffect(() => {
    if (!isLoading) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isLoading]);

  // If still loading after 10 seconds, add a more detailed message
  const longLoadingMessage = timeElapsed > 10 
    ? "Loading is taking longer than expected. You may need to refresh the page."
    : "Loading your profile...";

  // If loading, show a more informative loading spinner
  if (isLoading) {
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

  // After careful evaluation, if user is null but not loading anymore, redirect to login
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
