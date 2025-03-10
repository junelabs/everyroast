
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coffee, Store, UtensilsCrossed } from "lucide-react";
import ReviewsTab from "./tabs/ReviewsTab";
import FavoritesTab from "./tabs/FavoritesTab";
import SavedTab from "./tabs/SavedTab";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<string>("coffee");

  return (
    <Tabs defaultValue="coffee" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 max-w-md mb-8">
        <TabsTrigger value="coffee" className="flex items-center gap-2">
          <Coffee className="h-4 w-4" />
          <span>Coffee</span>
        </TabsTrigger>
        <TabsTrigger value="roasters" className="flex items-center gap-2">
          <Store className="h-4 w-4" />
          <span>Roasters</span>
        </TabsTrigger>
        <TabsTrigger value="recipes" className="flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4" />
          <span>Recipes</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="coffee">
        <ReviewsTab defaultTab={activeTab === "coffee"} />
      </TabsContent>
      
      <TabsContent value="roasters">
        <FavoritesTab />
      </TabsContent>
      
      <TabsContent value="recipes">
        <SavedTab />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
