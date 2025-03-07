
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Coffee, User, Settings, Heart, Bookmark, BookOpen, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [name, setName] = useState("Coffee Lover");
  const [username, setUsername] = useState("coffeelover");
  const [email, setEmail] = useState("user@example.com");
  const [bio, setBio] = useState("I'm a passionate coffee enthusiast who loves trying new roasts and brewing methods.");
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleProfileImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
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
      {/* Header with navigation */}
      <header className="w-full py-4 px-6 md:px-8 flex items-center justify-between bg-white border-b">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-roast-500" />
            <span className="text-xl font-bold text-roast-700">EveryRoast</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
          <Link to="/">
            <Button variant="outline">Sign Out</Button>
          </Link>
        </div>
      </header>
      
      <div className="container max-w-5xl mx-auto py-8 px-4">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
          <div 
            className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={handleProfileImageClick}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
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
                  <Button onClick={handleSaveProfile} className="bg-roast-500 hover:bg-roast-600">
                    Save Profile
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="text-gray-500 mb-1">@{username}</p>
                <p className="text-gray-600 mb-4">{email}</p>
                <p className="text-gray-800 mb-6 max-w-xl">{bio}</p>
                <Button onClick={() => setIsEditing(true)} className="bg-roast-500 hover:bg-roast-600">
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Profile content with tabs */}
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              <span>Saved</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Reviews</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="favorites" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite coffees yet</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Explore our collection and mark your favorite coffees to see them here.
                </p>
                <Link to="/">
                  <Button className="bg-roast-500 hover:bg-roast-600">
                    Explore Coffees
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center py-8">
                <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved items</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Save articles, brewing guides, and coffees to access them later.
                </p>
                <Link to="/">
                  <Button className="bg-roast-500 hover:bg-roast-600">
                    Discover Content
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Share your thoughts on coffees you've tried to help the community.
                </p>
                <Link to="/">
                  <Button className="bg-roast-500 hover:bg-roast-600">
                    Write a Review
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
