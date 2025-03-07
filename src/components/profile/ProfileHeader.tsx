
import { Coffee, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const ProfileHeader = () => {
  const { signOut } = useAuth();

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
        <Button variant="outline" onClick={signOut}>
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default ProfileHeader;
