
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth";
import ReviewsList from "./ReviewsList";
import ReviewsEmptyState from "./ReviewsEmptyState";
import ReviewFormModal from "./ReviewFormModal";
import AddReviewButton from "./AddReviewButton";

interface ReviewsTabContentProps {
  defaultTab?: boolean;
}

const ReviewsTabContent = ({ defaultTab = false }: ReviewsTabContentProps) => {
  const { user } = useAuth();
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch user reviews
  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['userReviews', user?.id],
    queryFn: async () => {
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
            deleted_at,
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
      
      // Filter out reviews for deleted coffees
      const validReviews = data?.filter(review => !review.coffees?.deleted_at) || [];
      console.log("Valid reviews (excluding deleted coffees):", validReviews.length);
      
      return validReviews;
    },
    enabled: !!user?.id,
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
    staleTime: 1000 * 60 * 2, // Consider data stale after 2 minutes
  });

  const handleEditReview = (review: any) => {
    setIsAddingNew(false);
    setSelectedReview(review);
    setIsReviewFormOpen(true);
  };

  const handleCloseReviewForm = () => {
    setIsReviewFormOpen(false);
    setIsAddingNew(false);
    setSelectedReview(null);
  };

  const handleAddNewReview = () => {
    setIsAddingNew(true);
    setSelectedReview(null);
    setTimeout(() => {
      setIsReviewFormOpen(true);
    }, 100);
  };

  const handleReviewDeleted = () => {
    setSelectedReview(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Coffee Log</h2>
        <AddReviewButton 
          isLoading={isLoading}
          onAddReview={handleAddNewReview}
        />
      </div>

      {reviews.length > 0 ? (
        <ReviewsList 
          reviews={reviews}
          isLoading={isLoading}
          onEdit={handleEditReview}
          onDelete={handleReviewDeleted}
        />
      ) : (
        <ReviewsEmptyState 
          isLoading={isLoading}
          error={error} 
          onAddReview={handleAddNewReview} 
        />
      )}
      
      <ReviewFormModal 
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

export default ReviewsTabContent;
