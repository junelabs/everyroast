
import { useState, useEffect } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileImage from "@/components/profile/ProfileImage";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { profile, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setProfileImage(profile.avatar_url || null);
    }
  }, [profile]);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setEmail(data.session.user.email || "");
      }
    };
    
    getSession();
  }, []);

  const handleSaveProfile = async () => {
    await updateProfile({
      full_name: name,
      username,
      bio
    });
    setIsEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Get user id from profile
      const userId = profile?.id;
      if (!userId) throw new Error('No user ID found');

      // Upload the file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // First, read as data URL for immediate preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Then, upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (error) throw error;

      // Get the public URL
      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (publicURL) {
        // Update the user's profile with the new avatar URL
        await updateProfile({
          avatar_url: publicURL.publicUrl
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // You could add a toast notification here for error handling
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-roast-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      
      <div className="container max-w-5xl mx-auto py-8 px-4">
        {/* Profile header */}
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
          />
        </div>
        
        <ProfileTabs />
      </div>
    </div>
  );
};

export default Profile;
