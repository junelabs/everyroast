
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 md:px-8 flex items-center justify-between z-10 relative">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Coffee className="h-8 w-8 text-coffee-500" />
        <span className="text-xl font-bold text-coffee-700">CoffeeChronicle</span>
      </div>
      
      {/* Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <a href="#features" className="text-coffee-700 hover:text-coffee-500 transition-colors">
          Features
        </a>
        <a href="#community" className="text-coffee-700 hover:text-coffee-500 transition-colors">
          Community
        </a>
        <a href="#explore" className="text-coffee-700 hover:text-coffee-500 transition-colors">
          Explore
        </a>
      </div>
      
      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        <Link to="/login">
          <Button variant="ghost" className="text-coffee-700 hover:text-coffee-500">Log in</Button>
        </Link>
        <Link to="/signup">
          <Button className="bg-coffee-500 hover:bg-coffee-600 text-white rounded-full px-6">
            Join Coffee Chronicle →
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
