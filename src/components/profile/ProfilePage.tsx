
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/auth";
import Header from "@/components/Header";
import ProfileContainer from "@/components/profile/ProfileContainer";
import PublicProfileView from "@/components/profile/PublicProfileView";
import Footer from "@/components/Footer";

const ProfilePage = () => {
  const { user, isLoading, authInitialized } = useAuth();
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const navigate = useNavigate();
  const { userId, username } = useParams();
  
  // Determine if we're viewing another user's profile
  const isViewingOtherProfile = !!(userId || username) && (userId !== user?.id);
  
  useEffect(() => {
    document.title = "Every Roast | Profile";
    
    // Only redirect to login if not viewing another user's profile
    if (!isViewingOtherProfile) {
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
    }
  }, [user, isLoading, authInitialized, isViewingOtherProfile, navigate]);

  // If authentication is complete and user is not logged in, redirect to login
  if (!isViewingOtherProfile && !isLoading && authInitialized && !user || redirectToLogin) {
    console.log("Profile page: Redirecting to login due to no user");
    navigate("/login", { replace: true });
    return null;
  }

  // Show loading state while authentication is in progress
  if (!isViewingOtherProfile && (isLoading || (!user && !authInitialized))) {
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
      {isViewingOtherProfile ? (
        <PublicProfileView />
      ) : (
        <ProfileContainer showHeader={false} />
      )}
      <Footer />
    </div>
  );
};

export default ProfilePage;
