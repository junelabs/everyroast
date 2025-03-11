
import { Coffee, Menu, Settings, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const ProfileHeader = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleSignOut = async () => {
    try {
      console.log("ProfileHeader: Signing out");
      if (!user) {
        console.log("No user session to sign out");
        toast({
          title: "Not signed in",
          description: "You are already signed out.",
        });
        navigate('/');
        return;
      }
      
      // First navigate, then sign out to prevent race conditions
      navigate('/');
      await signOut();
      closeMenu();
      
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
    <header className="w-full py-4 px-6 md:px-8 flex items-center justify-between bg-white border-b z-50 relative">
      {/* Logo - always visible */}
      <Link to="/" className="flex items-center gap-2">
        <Coffee className="h-6 w-6 text-roast-500" />
        <span className="text-xl font-bold text-roast-700">EveryRoast</span>
      </Link>
      
      {/* Hamburger Menu Button - visible on mobile only */}
      <button 
        className="md:hidden text-gray-700 hover:text-roast-500 p-2" 
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-end gap-4">
        <Button variant="ghost">
          <Settings className="h-5 w-5 mr-2" />
          Settings
        </Button>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
      
      {/* Mobile Navigation Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40">
          <div className="flex flex-col items-center justify-center min-h-screen gap-8">
            <Button variant="ghost" className="flex items-center gap-2 text-xl" onClick={closeMenu}>
              <Settings className="h-5 w-5" />
              Settings
            </Button>
            
            <Button variant="outline" className="text-xl" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default ProfileHeader;
