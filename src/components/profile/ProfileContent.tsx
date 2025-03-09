
import { useState } from "react";
import ProfileImage from "@/components/profile/ProfileImage";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileTabs from "@/components/profile/ProfileTabs";

interface ProfileContentProps {
  name: string;
  setName: (name: string) => void;
  username: string;
  setUsername: (username: string) => void;
  email: string;
  bio: string;
  setBio: (bio: string) => void;
  profileImage: string | null;
  handleSaveProfile: () => Promise<void>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
}

const ProfileContent = ({
  name,
  setName,
  username,
  setUsername,
  email,
  bio,
  setBio,
  profileImage,
  handleSaveProfile,
  handleFileChange,
  isUploading
}: ProfileContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const onSaveProfile = async () => {
    setIsEditing(false);
    await handleSaveProfile();
  };

  return (
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
          setEmail={() => {}} // Email is read-only
          bio={bio}
          setBio={setBio}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSaveProfile={onSaveProfile}
          isLoading={isUploading}
        />
      </div>
      
      <ProfileTabs />
    </div>
  );
};

export default ProfileContent;
