
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ReviewsList from './ReviewsList';
import ReviewsEmptyState from './ReviewsEmptyState';
import AddReviewButton from './AddReviewButton';
import ReviewForm from '@/components/reviews/ReviewForm';
import { ensureArray } from '@/components/ui/command';

interface ReviewsTabContentProps {
  userId?: string;
  showAddButton?: boolean;
}

const ReviewsTabContent = ({ userId, showAddButton = true }: ReviewsTabContentProps) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const { data: reviews, isLoading, error, refetch } = useQuery({
    queryKey: ['userReviews', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          review_text,
          brewing_method,
          created_at,
          coffee_id,
          dosage,
          water,
          temperature,
          brew_time,
          brew_notes,
          coffees (
            id,
            name,
            roaster_id,
            image_url,
            roasters (name)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reviews:', error);
        throw new Error('Failed to fetch reviews');
      }
      
      return data || [];
    },
    enabled: !!userId,
  });

  const handleReviewAdded = () => {
    refetch();
    setIsReviewFormOpen(false);
    setSelectedReview(null);
  };

  const handleAddReview = () => {
    setSelectedReview(null);
    setIsReviewFormOpen(true);
  };

  const handleEditReview = (review: any) => {
    setSelectedReview(review);
    setIsReviewFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roast-500"></div>
      </div>
    );
  }

  // Make sure reviews is always an array with enhanced safety
  const safeReviews = ensureArray(reviews);
  const hasReviews = safeReviews.length > 0;

  // Prepare initialData for ReviewForm with safe defaults
  const getInitialData = (review: any) => {
    if (!review) return undefined;
    return {
      rating: review?.rating || 0,
      reviewText: review?.review_text || "",
      brewingMethod: review?.brewing_method || "",
      dosage: review?.dosage || 0,
      water: review?.water || 0,
      temperature: review?.temperature || 0,
      brewTime: review?.brew_time || "",
      brewNotes: review?.brew_notes || ""
    };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {showAddButton ? 'My Reviews' : 'Reviews'}
        </h2>
        {showAddButton && (
          <AddReviewButton 
            isLoading={isLoading}
            onAddReview={handleAddReview}
          />
        )}
      </div>
      
      {hasReviews ? (
        <ReviewsList 
          reviews={safeReviews} 
          onReviewDeleted={refetch} 
          onReviewEdit={handleEditReview}
          showDeleteButton={showAddButton}
        />
      ) : (
        <ReviewsEmptyState 
          isLoading={isLoading}
          error={error as Error | null}
          onAddReview={handleAddReview}
        />
      )}

      {isReviewFormOpen && (
        <ReviewForm 
          isOpen={isReviewFormOpen}
          onClose={() => {
            setIsReviewFormOpen(false);
            setSelectedReview(null);
          }}
          coffeeId={selectedReview?.coffee_id}
          reviewId={selectedReview?.id}
          initialData={getInitialData(selectedReview)}
          isEdit={!!selectedReview}
          reviewCount={safeReviews.length}
          showSelector={!selectedReview}
        />
      )}
    </div>
  );
};

export default ReviewsTabContent;
