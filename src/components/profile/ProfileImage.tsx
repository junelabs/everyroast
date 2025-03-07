
import { useRef } from "react";
import { Upload, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileImageProps {
  profileImage: string | null;
  name: string;
  isEditing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImage = ({ profileImage, name, isEditing, onFileChange }: ProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleProfileImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ${isEditing ? 'cursor-pointer' : ''}`}
      onClick={handleProfileImageClick}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={onFileChange}
      />
      {profileImage ? (
        <Avatar className="w-full h-full">
          <AvatarImage src={profileImage} alt={name} className="object-cover" />
          <AvatarFallback className="bg-roast-100 text-roast-500 text-2xl">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="w-full h-full">
          <AvatarFallback className="bg-roast-100 text-roast-500 flex items-center justify-center">
            <User className="w-12 h-12 md:w-16 md:h-16" />
          </AvatarFallback>
        </Avatar>
      )}
      
      {isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity hover:bg-opacity-60">
          <Upload className="w-8 h-8 text-white" />
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
