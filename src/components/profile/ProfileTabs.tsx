
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Bookmark, BookOpen } from "lucide-react";
import ReviewsTab from "./tabs/ReviewsTab";
import FavoritesTab from "./tabs/FavoritesTab";
import SavedTab from "./tabs/SavedTab";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<string>("reviews");

  return (
    <Tabs defaultValue="reviews" className="w-full" onValueChange={setActiveTab}>
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
      
      <TabsContent value="reviews">
        <ReviewsTab defaultTab={activeTab === "reviews"} />
      </TabsContent>
      
      <TabsContent value="favorites">
        <FavoritesTab />
      </TabsContent>
      
      <TabsContent value="saved">
        <SavedTab />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
