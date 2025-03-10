
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const FavoritesTab = () => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default FavoritesTab;
