
import { Coffee, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useToast } from "@/components/ui/use-toast";

const ProfileHeader = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      console.log("ProfileHeader: Signing out");
      if (!user) {
        console.log("No user session to sign out");
        toast({
          title: "Not signed in",
          description: "You are already signed out.",
        });
        navigate('/login');
        return;
      }
      
      await signOut();
      // Navigation is handled by auth state change listener in AuthContext
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
      // Redirect to login page anyway on error
      navigate('/login');
    }
  };

  return (
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
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default ProfileHeader;
