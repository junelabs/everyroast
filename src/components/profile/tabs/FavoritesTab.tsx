
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";

const FavoritesTab = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-8">
          <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite roasters yet</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Follow your favorite coffee roasters to see their latest offerings.
          </p>
          <Link to="/roasters">
            <Button className="bg-roast-500 hover:bg-roast-600">
              Discover Roasters
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FavoritesTab;
