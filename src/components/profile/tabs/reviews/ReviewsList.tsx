
import React from 'react';
import { format } from 'date-fns';
import ReviewRowCard from '@/components/reviews/ReviewRowCard';

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
  reviews: Review[];
  onReviewDeleted: () => void;
  showDeleteButton?: boolean;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ 
  reviews, 
  onReviewDeleted,
  showDeleteButton = true
}) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id}>
          <ReviewRowCard 
            review={{
              id: review.id,
              rating: review.rating,
              review_text: review.review_text,
              brewing_method: review.brewing_method,
              created_at: review.created_at,
              coffee_id: review.coffee_id,
              coffees: review.coffees
            }}
            onEdit={() => {}} // Placeholder, actual edit functionality would be implemented elsewhere
            onDelete={showDeleteButton ? onReviewDeleted : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
