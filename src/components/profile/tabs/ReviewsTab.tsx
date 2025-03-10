
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewCard from "@/components/reviews/ReviewCard";

interface ReviewsTabProps {
  defaultTab?: boolean;
}

const ReviewsTab = ({ defaultTab = false }: ReviewsTabProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  // Modified: Only fetch reviews when the form closes after editing, not after deleting
  useEffect(() => {
    if (!isReviewFormOpen && selectedReview) {
      if (!isAddingNew) {
        setSelectedReview(null);
      }
      fetchUserReviews();
    }
  }, [isReviewFormOpen]);

  const fetchUserReviews = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching reviews for user ID:", user?.id);
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
            origin,
            roast_level,
            process_method,
            price,
            flavor_notes,
            type,
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
        console.log("Reviews fetched successfully:", data);
        // Add debug logging to check the type field
        if (data && data.length > 0) {
          console.log("Sample coffee type:", data[0].coffees?.type);
        }
        setReviews(data || []);
      }
    } catch (error) {
      console.error("Error in fetchUserReviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditReview = (review: any) => {
    setIsAddingNew(false);
    setSelectedReview(review);
    setIsReviewFormOpen(true);
  };

  const handleCloseReviewForm = () => {
    setIsReviewFormOpen(false);
    setIsAddingNew(false);
    setSelectedReview(null);
    fetchUserReviews();
  };

  const handleAddNewReview = () => {
    setIsAddingNew(true);
    setSelectedReview(null);
    setTimeout(() => {
      setIsReviewFormOpen(true);
    }, 100);
  };

  // Added: Function to handle review deletion
  const handleReviewDeleted = () => {
    setSelectedReview(null);
    fetchUserReviews();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Reviews</h2>
        <Button 
          onClick={handleAddNewReview} 
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {reviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onEdit={handleEditReview}
              onDelete={handleReviewDeleted}
            />
          ))}
        </div>
      ) : (
        <EmptyReviewsState onAddReview={handleAddNewReview} />
      )}
      
      <ReviewForm 
        isOpen={isReviewFormOpen} 
        onClose={handleCloseReviewForm} 
        coffeeId={selectedReview?.coffee_id}
        reviewId={!isAddingNew ? selectedReview?.id : undefined}
        initialData={{
          rating: selectedReview?.rating || 0,
          reviewText: selectedReview?.review_text || "",
          brewingMethod: selectedReview?.brewing_method || ""
        }}
        isEdit={!isAddingNew && !!selectedReview}
      />
    </div>
  );
};

export default ReviewsTab;

// Empty state component for reviews tab
const EmptyReviewsState = ({ onAddReview }: { onAddReview: () => void }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="text-center py-8">
      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        Share your thoughts on coffees you've tried to help the community.
      </p>
      <Button 
        onClick={onAddReview} 
        className="bg-roast-500 hover:bg-roast-600"
      >
        Write a Review
      </Button>
    </div>
  </div>
);
