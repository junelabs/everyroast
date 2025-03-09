import { useState, useEffect } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileImage from "@/components/profile/ProfileImage";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { profile, updateProfile, isLoading: authLoading, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const { toast } = useToast();

  console.log("Auth loading state:", authLoading);
  console.log("User state:", user);
  console.log("Profile state:", profile);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setProfileImage(profile.avatar_url || null);
      setProfileLoading(false);
    } else if (!authLoading && user) {
      fetchProfileManually(user.id);
    } else if (!authLoading && !user) {
      setProfileLoading(false);
    }
  }, [profile, authLoading, user]);

  const fetchProfileManually = async (userId: string) => {
    try {
      console.log("Manually fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile manually:", error);
        setProfileLoading(false);
        return;
      }
      
      if (data) {
        setName(data.full_name || "");
        setUsername(data.username || "");
        setBio(data.bio || "");
        setProfileImage(data.avatar_url || null);
      }
    } catch (error) {
      console.error("Error in manual profile fetch:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (data.session?.user) {
          setEmail(data.session.user.email || "");
        }
      } catch (error: any) {
        console.error("Error fetching session:", error.message);
      }
    };
    
    getSession();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (profileLoading || authLoading) {
        console.log("Forcing exit from loading state after timeout");
        setProfileLoading(false);
      }
    }, 5000); // 5 second fallback timeout

    return () => clearTimeout(timeoutId);
  }, [profileLoading, authLoading]);

  const handleSaveProfile = async () => {
    try {
      setIsEditing(false);
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
      console.error("Error saving profile:", error);
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

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (publicURL) {
        await updateProfile({
          avatar_url: publicURL.publicUrl
        });
        toast({
          title: "Image uploaded",
          description: "Your profile picture has been updated",
        });
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isPageLoading = authLoading || profileLoading;

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roast-500 mb-4"></div>
        <div className="text-roast-600">Loading profile...</div>
        <div className="text-gray-500 text-sm mt-2">This should only take a moment.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
          <ProfileImage 
            profileImage={profileImage}
            name={name || "User"}
            isEditing={isEditing}
            onFileChange={handleFileChange}
          />
          
          <ProfileForm 
            name={name}
            setName={setName}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            bio={bio}
            setBio={setBio}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSaveProfile={handleSaveProfile}
            isLoading={isUploading}
          />
        </div>
        
        <ProfileTabs />
      </div>
    </div>
  );
};

export default Profile;
