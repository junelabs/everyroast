
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
  onReviewEdit: (review: any) => void; // Added missing prop
  showDeleteButton?: boolean;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ 
  reviews, 
  onReviewDeleted,
  onReviewEdit,
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
            onEdit={() => onReviewEdit(review)} // Pass the review object to the edit function
            onDelete={showDeleteButton ? onReviewDeleted : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
