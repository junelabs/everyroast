import { Button } from "@/components/ui/button";
import { Coffee, Menu, User, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const Header = () => {
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if we're on home page
  const isHomePage = location.pathname === "/";

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleSignOut = async () => {
    try {
      console.log("Header: Signing out");
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
    <header className={`w-full py-4 px-6 md:px-8 flex items-center justify-between z-50 ${
      isHomePage 
        ? 'bg-transparent absolute top-0 left-0 right-0' 
        : 'bg-white sticky top-0 border-b border-gray-100 shadow-sm'
    }`}>
      {/* Logo - always visible */}
      <Link to="/" className="flex items-center gap-2">
        <Coffee className={`h-8 w-8 ${isHomePage ? 'text-white' : 'text-roast-500'}`} />
        <span className={`text-xl font-bold ${isHomePage ? 'text-white' : 'text-roast-700'}`}>Every Roast</span>
      </Link>
      
      {/* Hamburger Menu Button - visible on mobile only */}
      <button 
        className={`md:hidden p-2 ${isHomePage ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-roast-500'}`} 
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/roasters" className={`transition-colors font-bold ${isHomePage ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-roast-500'}`}>
          Roasters
        </Link>
        <Link to="/cafes" className={`transition-colors font-bold ${isHomePage ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-roast-500'}`}>
          Cafes
        </Link>
        <Link to="/recipes" className={`transition-colors font-bold ${isHomePage ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-roast-500'}`}>
          Recipes
        </Link>
        
        {/* Auth Buttons on Desktop */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button variant={isHomePage ? "outline" : "outline"} className={`flex items-center gap-2 ${isHomePage ? 'border-white text-white hover:bg-white/10' : ''}`}>
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className={isHomePage ? 'text-white hover:text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:text-roast-500'}
                onClick={handleSignOut}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className={isHomePage ? 'text-white hover:text-gray-200 hover:bg-white/10 font-bold' : 'text-gray-700 hover:text-roast-500'}>
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className={`rounded-full px-6 ${isHomePage ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
                  Join Every Roast →
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40">
          {/* Close button positioned at top right */}
          <button 
            className="absolute top-4 right-6 p-2 text-gray-700 hover:text-roast-500"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={32} />
          </button>

          <div className="flex flex-col items-center justify-center min-h-screen gap-8">
            {/* Navigation Links */}
            <div className="flex flex-col items-center gap-8 mb-8">
              <Link 
                to="/roasters" 
                className="text-gray-700 hover:text-roast-500 transition-colors text-xl font-bold"
                onClick={closeMenu}
              >
                Roasters
              </Link>
              <Link 
                to="/cafes" 
                className="text-gray-700 hover:text-roast-500 transition-colors text-xl font-bold"
                onClick={closeMenu}
              >
                Cafes
              </Link>
              <Link 
                to="/recipes" 
                className="text-gray-700 hover:text-roast-500 transition-colors text-xl font-bold"
                onClick={closeMenu}
              >
                Recipes
              </Link>
            </div>
            
            {/* Auth Buttons on Mobile */}
            <div className="flex flex-col w-full gap-4 items-center px-6">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="w-full" onClick={closeMenu}>
                    <Button variant="outline" className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:text-roast-500 w-full"
                    onClick={handleSignOut}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full" onClick={closeMenu}>
                    <Button variant="ghost" className="text-gray-700 hover:text-roast-500 w-full font-bold">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full" onClick={closeMenu}>
                    <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 w-full">
                      Join Every Roast →
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
