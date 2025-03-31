
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ReviewsList from './ReviewsList';
import ReviewsEmptyState from './ReviewsEmptyState';
import AddReviewButton from './AddReviewButton';

interface ReviewsTabContentProps {
  userId?: string;
  showAddButton?: boolean;
}

const ReviewsTabContent = ({ userId, showAddButton = true }: ReviewsTabContentProps) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

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
  };

  const handleAddReview = () => {
    setIsReviewFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-roast-500"></div>
      </div>
    );
  }

  const hasReviews = reviews && reviews.length > 0;

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
          reviews={reviews} 
          onReviewDeleted={refetch} 
          showDeleteButton={showAddButton}
        />
      ) : (
        <ReviewsEmptyState 
          isLoading={isLoading}
          error={error as Error | null}
          onAddReview={handleAddReview}
        />
      )}
    </div>
  );
};

export default ReviewsTabContent;
