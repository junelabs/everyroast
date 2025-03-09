
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Bookmark, BookOpen, Plus, Star, Coffee } from "lucide-react";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import ReviewForm from "@/components/reviews/ReviewForm";

const ProfileTabs = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          review_text,
          brewing_method,
          created_at,
          coffee_id,
          coffees (
            id,
            name,
            image_url,
            roaster_id,
            roasters (
              name
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      console.error("Error in fetchUserReviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Reviews</h2>
          <Button 
            onClick={() => setIsReviewFormOpen(true)} 
            className="bg-roast-500 hover:bg-roast-600 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Review
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {review.coffees?.name || "Unnamed Coffee"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {review.coffees?.roasters?.name || "Unknown Roaster"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{review.rating}</span>
                  </div>
                </div>
                
                {review.brewing_method && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Brewing Method:</span> {review.brewing_method}
                  </div>
                )}
                
                {review.review_text && (
                  <p className="mt-2 text-gray-700">{review.review_text}</p>
                )}
                
                <div className="mt-3 text-xs text-gray-500">
                  {formatDate(review.created_at)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Share your thoughts on coffees you've tried to help the community.
              </p>
              <Button 
                onClick={() => setIsReviewFormOpen(true)} 
                className="bg-roast-500 hover:bg-roast-600"
              >
                Write a Review
              </Button>
            </div>
          </div>
        )}
        
        <ReviewForm 
          isOpen={isReviewFormOpen} 
          onClose={() => {
            setIsReviewFormOpen(false);
            fetchUserReviews();
          }} 
        />
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
