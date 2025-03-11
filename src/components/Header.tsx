
import { Button } from "@/components/ui/button";
import { Coffee, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { useToast } from "@/components/ui/use-toast";

const Header = () => {
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      console.log("Header: Signing out");
      if (!user) {
        console.log("No user session to sign out");
        toast({
          title: "Not signed in",
          description: "You are already signed out.",
        });
        navigate('/login');
        return;
      }
      
      // First navigate, then sign out to prevent race conditions
      navigate('/login');
      await signOut();
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out from your account.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="w-full py-4 px-6 md:px-8 flex items-center justify-between z-10 relative">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <Coffee className="h-8 w-8 text-roast-500" />
        <span className="text-xl font-bold text-roast-700">Every Roast</span>
      </Link>
      
      {/* Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/roasters" className="text-gray-700 hover:text-roast-500 transition-colors">
          Roasters
        </Link>
        <Link to="/cafes" className="text-gray-700 hover:text-roast-500 transition-colors">
          Cafes
        </Link>
        <Link to="/recipes" className="text-gray-700 hover:text-roast-500 transition-colors">
          Recipes
        </Link>
      </div>
      
      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/profile">
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-roast-500"
              onClick={handleSignOut}
            >
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-roast-500">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-roast-500 hover:bg-roast-600 text-white rounded-full px-6">
                Join Every Roast →
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
