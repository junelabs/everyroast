
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";

const SavedTab = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-8">
          <UtensilsCrossed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Discover and save brewing recipes to try with your favorite coffees.
          </p>
          <Link to="/">
            <Button className="bg-roast-500 hover:bg-roast-600">
              Explore Recipes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SavedTab;
