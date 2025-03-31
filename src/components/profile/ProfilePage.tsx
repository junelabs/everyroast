
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  const location = useLocation();
  
  // Check if this is a username route (not in /profile or /profile/ID format)
  const isUsernameRoute = location.pathname.split('/').length === 2 && 
                         !location.pathname.startsWith('/profile');
  
  // If we have a username parameter or the path itself is a username, we're viewing another profile
  const isViewingOtherProfile = !!(userId || username || isUsernameRoute) && 
                                (userId !== user?.id);
  
  const usernameToUse = username || (isUsernameRoute ? location.pathname.substring(1) : null);
  
  useEffect(() => {
    document.title = "Every Roast | Profile";
    
    console.log("Profile page route info:", { 
      path: location.pathname,
      userId, 
      username, 
      isUsernameRoute,
      usernameToUse,
      isViewingOtherProfile
    });
    
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
  }, [user, isLoading, authInitialized, isViewingOtherProfile, navigate, location.pathname, userId, username, isUsernameRoute]);

  // If authentication is complete and user is not logged in, redirect to login
  // But only if we're not viewing another profile
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
        <PublicProfileView usernameFromPath={usernameToUse} />
      ) : (
        <ProfileContainer showHeader={false} />
      )}
      <Footer />
    </div>
  );
};

export default ProfilePage;
