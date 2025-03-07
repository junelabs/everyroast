
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileImage from "@/components/profile/ProfileImage";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileTabs from "@/components/profile/ProfileTabs";

const Profile = () => {
  const [name, setName] = useState("Coffee Lover");
  const [username, setUsername] = useState("coffeelover");
  const [email, setEmail] = useState("user@example.com");
  const [bio, setBio] = useState("I'm a passionate coffee enthusiast who loves trying new roasts and brewing methods.");
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      
      <div className="container max-w-5xl mx-auto py-8 px-4">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
          <ProfileImage 
            profileImage={profileImage}
            name={name}
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
