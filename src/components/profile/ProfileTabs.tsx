
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ReviewsTabContent from "@/components/profile/tabs/reviews/ReviewsTabContent";
import FavoritesTab from "@/components/profile/tabs/FavoritesTab";
import SavedTab from "@/components/profile/tabs/SavedTab";
import { useAuth } from "@/context/auth";

interface ProfileTabsProps {
  viewingUserId?: string;
}

const ProfileTabs = ({ viewingUserId }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState("reviews");
  const { user } = useAuth();
  
  const isOwnProfile = !viewingUserId || (user && viewingUserId === user.id);
  const effectiveUserId = viewingUserId || user?.id;

  return (
    <Card className="p-6">
      <Tabs defaultValue="reviews" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          {isOwnProfile && <TabsTrigger value="favorites">Favorites</TabsTrigger>}
          {isOwnProfile && <TabsTrigger value="saved">Recipes</TabsTrigger>}
          {!isOwnProfile && <TabsTrigger value="none" disabled className="opacity-50">Favorites</TabsTrigger>}
          {!isOwnProfile && <TabsTrigger value="none2" disabled className="opacity-50">Recipes</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="reviews" className="space-y-4">
          <ReviewsTabContent 
            userId={effectiveUserId} 
            showAddButton={isOwnProfile} 
          />
        </TabsContent>
        
        {isOwnProfile && (
          <>
            <TabsContent value="favorites" className="space-y-4">
              <FavoritesTab />
            </TabsContent>
            
            <TabsContent value="saved" className="space-y-4">
              <SavedTab />
            </TabsContent>
          </>
        )}
      </Tabs>
    </Card>
  );
};

export default ProfileTabs;
