
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import ProfileContainer from "@/components/profile/ProfileContainer";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/auth";

const Profile = () => {
  const { user, isLoading, authInitialized } = useAuth();
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  
  useEffect(() => {
    document.title = "Every Roast | Profile";
    console.log("Profile page: Authentication state:", { 
      user: !!user, 
      isLoading, 
      authInitialized,
      userId: user?.id 
    });
    
    // Set a timeout to redirect if auth still not resolved after a delay
    const timeoutId = setTimeout(() => {
      if (!user && authInitialized && !isLoading) {
        console.log("Profile page: No user after timeout, redirecting to login");
        setRedirectToLogin(true);
      }
    }, 2000); // 2 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [user, isLoading, authInitialized]);

  // If authentication is complete and user is not logged in, redirect to login
  if (!isLoading && authInitialized && !user || redirectToLogin) {
    console.log("Profile page: Redirecting to login due to no user");
    return <Navigate to="/login" replace />;
  }

  // Show loading state while authentication is in progress
  if (isLoading || (!user && !authInitialized)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roast-500 mb-4"></div>
        <div className="text-roast-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ProfileContainer showHeader={false} />
      <Footer />
    </div>
  );
};

export default Profile;
