
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  setIsEditing: (isEditing: boolean) => void;
  handleSaveProfile: () => void;
  isLoading?: boolean; // Added optional isLoading prop
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
  isLoading = false // Added with default value
}: ProfileFormProps) => {
  return (
    <div className="flex-1">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="max-w-md"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="flex max-w-md">
              <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-input rounded-l-md">
                <span className="text-gray-500">@</span>
              </div>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="rounded-l-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="max-w-md"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea 
              id="bio" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              className="w-full max-w-md h-24 px-3 py-2 text-base border border-input bg-background rounded-md"
            />
          </div>
          <div className="space-x-2 pt-2">
            <Button 
              onClick={handleSaveProfile} 
              className="bg-roast-500 hover:bg-roast-600"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                  Saving...
                </span>
              ) : "Save Profile"}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          <p className="text-gray-500 mb-1">@{username}</p>
          {/* Email is now hidden in the non-edit view */}
          <p className="text-gray-800 mb-6 max-w-xl">{bio}</p>
          <Button onClick={() => setIsEditing(true)} className="bg-roast-500 hover:bg-roast-600">
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
