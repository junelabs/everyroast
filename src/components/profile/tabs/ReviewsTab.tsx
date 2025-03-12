import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewCard from "@/components/reviews/ReviewCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewsTabProps {
  defaultTab?: boolean;
}

const ReviewsTab = ({ defaultTab = false }: ReviewsTabProps) => {
  const { user } = useAuth();
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Memoize the fetch function
  const fetchUserReviews = useCallback(async () => {
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
      throw error;
    }
    
    console.log("Reviews fetched successfully:", data);
    return data || [];
  }, [user?.id]);

  // Use React Query for better caching and loading states
  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['userReviews', user?.id],
    queryFn: fetchUserReviews,
    enabled: !!user?.id,
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
    staleTime: 1000 * 60 * 2, // Consider data stale after 2 minutes
  });

  const handleEditReview = useCallback((review: any) => {
    setIsAddingNew(false);
    setSelectedReview(review);
    setIsReviewFormOpen(true);
  }, []);

  const handleCloseReviewForm = useCallback(() => {
    setIsReviewFormOpen(false);
    setIsAddingNew(false);
    setSelectedReview(null);
  }, []);

  const handleAddNewReview = useCallback(() => {
    setIsAddingNew(true);
    setSelectedReview(null);
    setTimeout(() => {
      setIsReviewFormOpen(true);
    }, 100);
  }, []);

  const handleReviewDeleted = useCallback(() => {
    setSelectedReview(null);
  }, []);

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Reviews</h2>
          <Button disabled className="bg-roast-500 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Review
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square">
              <Skeleton className="w-full h-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading reviews. Please try again later.</p>
      </div>
    );
  }

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

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default ReviewsTab;
