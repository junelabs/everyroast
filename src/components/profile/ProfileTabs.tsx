
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Bookmark, BookOpen } from "lucide-react";

const ProfileTabs = () => {
  return (
    <Tabs defaultValue="reviews" className="w-full">
      <TabsList className="grid grid-cols-3 max-w-md mb-8">
        <TabsTrigger value="reviews" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>Reviews</span>
        </TabsTrigger>
        <TabsTrigger value="favorites" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          <span>Favorites</span>
        </TabsTrigger>
        <TabsTrigger value="saved" className="flex items-center gap-2">
          <Bookmark className="h-4 w-4" />
          <span>Saved</span>
        </TabsTrigger>
      </TabsList>
      
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
    </Tabs>
  );
};

export default ProfileTabs;
