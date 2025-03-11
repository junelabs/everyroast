
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  // If the user is not authenticated and we're not loading, redirect to login
  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }
  
  // If the user is authenticated, redirect to profile
  if (user && !isLoading) {
    return <Navigate to="/profile" replace />;
  }

  // Show a loading state while auth is being determined
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-roast-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
