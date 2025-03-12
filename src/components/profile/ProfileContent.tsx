
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
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full flex items-center gap-4">
            <ProfileImage 
              profileImage={profileImage}
              name={name || "User"}
              isEditing={isEditing}
              isUploading={isUploading}
              onFileChange={handleFileChange}
            />
            
            {/* Mobile-only name and username moved beside profile image */}
            <div className="md:hidden flex-1">
              <h2 className="text-xl font-semibold text-gray-800">
                {name || "User Profile"}
              </h2>
              <p className="text-gray-600">@{username || "username"}</p>
              
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 mt-2"
                  size="sm"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              ) : (
                <Button 
                  onClick={onSaveProfile}
                  disabled={isUploading}
                  className="bg-roast-500 hover:bg-roast-600 flex items-center gap-2 mt-2"
                  size="sm"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save</span>
                </Button>
              )}
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
