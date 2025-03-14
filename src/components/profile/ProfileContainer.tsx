
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileContent from "@/components/profile/ProfileContent";

interface ProfileContainerProps {
  showHeader?: boolean;
}

const ProfileContainer = ({ showHeader = true }: ProfileContainerProps) => {
  const { profile, updateProfile, isLoading: authLoading, user, authInitialized } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  console.log("ProfileContainer: Auth state:", { 
    authLoading, 
    authInitialized,
    userId: user?.id,
    profileId: profile?.id,
    profileLoading
  });

  // If authentication is complete and no user, redirect to login
  useEffect(() => {
    if (!authLoading && authInitialized && !user) {
      console.log("ProfileContainer: No authenticated user, redirecting to login");
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, authInitialized, navigate]);

  // Set a shorter timeout for profile loading to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (profileLoading) {
        console.log("ProfileContainer: Forcing exit from loading state after timeout");
        setProfileLoading(false);
      }
    }, 3000); // 3-second timeout

    return () => clearTimeout(timeoutId);
  }, [profileLoading]);

  useEffect(() => {
    if (profile) {
      console.log("ProfileContainer: Setting form data from profile", profile.id);
      setName(profile.full_name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setProfileImage(profile.avatar_url || null);
      setProfileLoading(false);
    } else if (!authLoading && user) {
      setProfileLoading(true);
      // If we have user but no profile, create a default empty profile display
      if (user.email) {
        setEmail(user.email || "");
      }
      // Try to extract a username from the email if available
      if (user.email && !username) {
        const emailUsername = user.email.split('@')[0];
        setUsername(emailUsername || "");
      }
    } else if (!authLoading && !user && authInitialized) {
      setProfileLoading(false);
    }
  }, [profile, authLoading, user, authInitialized, username]);

  useEffect(() => {
    if (!user) return;
    
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (data.session?.user) {
          setEmail(data.session.user.email || "");
        }
      } catch (error: any) {
        console.error("ProfileContainer: Error fetching session:", error.message);
      }
    };
    
    getSession();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        full_name: name,
        username,
        bio
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      console.error("ProfileContainer: Error saving profile:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const userId = user?.id;
      if (!userId) throw new Error('No user ID found');

      // Create a unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Display a preview immediately while uploading
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded image
      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (publicURL) {
        // Update the profile with the new avatar URL
        await updateProfile({
          avatar_url: publicURL.publicUrl
        });
        
        toast({
          title: "Image uploaded",
          description: "Your profile picture has been updated",
        });
      }
    } catch (error: any) {
      console.error('ProfileContainer: Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Only show loading for a maximum of 3 seconds
  const isPageLoading = (authLoading || (profileLoading && !!user)) && profileLoading;

  // If no authenticated user after loading is complete, show empty state
  if (!isPageLoading && !user && authInitialized && !authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-roast-600 text-lg">Please log in to view your profile</div>
        <button 
          className="mt-4 px-4 py-2 bg-roast-500 text-white rounded-md hover:bg-roast-600"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <ProfileHeader />}
      
      {isPageLoading ? (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roast-500 mb-4"></div>
          <div className="text-roast-600">Loading profile...</div>
          <div className="text-gray-500 text-sm mt-2">This should only take a moment.</div>
        </div>
      ) : (
        <ProfileContent 
          name={name}
          setName={setName}
          username={username}
          setUsername={setUsername}
          email={email}
          bio={bio}
          setBio={setBio}
          profileImage={profileImage}
          handleSaveProfile={handleSaveProfile}
          handleFileChange={handleFileChange}
          isUploading={isUploading}
        />
      )}
    </div>
  );
};

export default ProfileContainer;
