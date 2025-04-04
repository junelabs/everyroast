
import React from 'react';
import { format } from 'date-fns';
import ReviewRowCard from '@/components/reviews/ReviewRowCard';

// Ensure we always have a valid array, even with deeply nested nullish values
const ensureArray = <T,>(value: T[] | null | undefined): T[] => {
  if (value === null || value === undefined) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [];
};

interface Review {
  id: string;
  rating: number;
  review_text?: string;
  brewing_method?: string;
  created_at: string;
  coffee_id: string;
  coffees: {
    id: string;
    name: string;
    roaster_id: string;
    image_url?: string;
    roasters: {
      name: string;
    };
  };
}

interface ReviewsListProps {
  reviews: Review[] | null | undefined;
  onReviewDeleted: () => void;
  onReviewEdit: (review: any) => void;
  showDeleteButton?: boolean;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ 
  reviews, 
  onReviewDeleted,
  onReviewEdit,
  showDeleteButton = true
}) => {
  // Ensure reviews is always a valid array even if somehow we get null/undefined
  const safeReviews = ensureArray(reviews);
  
  return (
    <div className="space-y-4">
      {safeReviews.map((review) => (
        <div key={review.id}>
          <ReviewRowCard 
            review={{
              id: review.id,
              rating: review.rating,
              review_text: review.review_text || "",
              brewing_method: review.brewing_method || "",
              created_at: review.created_at,
              coffee_id: review.coffee_id,
              coffees: review.coffees || { 
                id: "", 
                name: "Unknown", 
                roaster_id: "", 
                roasters: { name: "Unknown Roaster" } 
              }
            }}
            onEdit={() => onReviewEdit(review)}
            onDelete={showDeleteButton ? onReviewDeleted : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
