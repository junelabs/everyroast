
import React from 'react';
import { Link } from 'react-router-dom';
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
            id={review.id}
            coffeeId={review.coffee_id}
            coffeeName={review.coffees.name}
            roasterName={review.coffees.roasters.name}
            rating={review.rating}
            reviewText={review.review_text}
            imageUrl={review.coffees.image_url}
            date={format(new Date(review.created_at), 'MMM d, yyyy')}
            brewingMethod={review.brewing_method}
            onDelete={showDeleteButton ? onReviewDeleted : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
