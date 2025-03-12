
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
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="flex flex-col items-center">
            <ProfileImage 
              profileImage={profileImage}
              name={name || "User"}
              isEditing={isEditing}
              isUploading={isUploading}
              onFileChange={handleFileChange}
            />
            
            {/* Mobile-only name and username */}
            <div className="md:hidden mt-4 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {name || "User Profile"}
              </h2>
              <p className="text-gray-600">@{username || "username"}</p>
            </div>
          </div>
          
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
      </div>
      
      <ProfileTabs />
    </div>
  );
};

export default ProfileContent;
