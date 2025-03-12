
import { Button } from "@/components/ui/button";
import { Edit, Save, Loader2 } from "lucide-react";

interface ProfileFormProps {
  name: string;
  setName: (name: string) => void;
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  handleSaveProfile: () => void;
  isLoading: boolean;
}

const ProfileForm = ({
  name,
  setName,
  username,
  setUsername,
  email,
  setEmail,
  bio,
  setBio,
  isEditing,
  setIsEditing,
  handleSaveProfile,
  isLoading
}: ProfileFormProps) => {
  return (
    <div className="flex-1 bg-white min-h-[12rem] p-4 md:p-6 rounded-lg shadow-sm flex flex-col justify-center w-full">
      <div className="flex justify-between items-center mb-4">
        {/* Hide name/username on mobile as they're shown beside the avatar */}
        <h2 className="text-xl font-semibold text-gray-800 hidden md:block">
          {name || "User Profile"}
        </h2>
        <div className="hidden md:block">
          {!isEditing ? (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 ml-auto"
              size="sm"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          ) : (
            <Button 
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="bg-roast-500 hover:bg-roast-600 flex items-center gap-2 ml-auto"
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Save Changes</span>
              <span className="sm:hidden">Save</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Username shown only on desktop */}
        <p className="text-gray-600 hidden md:block">@{username || "username"}</p>
        
        {isEditing ? (
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-roast-500 text-lg font-medium"
              placeholder="Your full name"
            />
          </div>
        ) : (
          <div className="text-lg text-gray-800 font-medium"></div>
        )}
        
        {isEditing ? (
          <div className="flex items-center">
            <span className="bg-gray-100 px-3 py-1 border border-r-0 border-gray-300 rounded-l-md text-gray-500">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-roast-500"
              placeholder="username"
            />
          </div>
        ) : null}
        
        {/* Email field is hidden but still editable when in edit mode */}
        {isEditing && (
          <div className="hidden">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-roast-500"
              placeholder="email@example.com"
            />
          </div>
        )}
        
        {isEditing ? (
          <div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-roast-500 resize-none min-h-[4.5rem]"
              placeholder="Tell us about yourself..."
            />
          </div>
        ) : (
          <p className="text-gray-700 line-clamp-3 min-h-[3rem]">{bio || "No bio provided"}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
