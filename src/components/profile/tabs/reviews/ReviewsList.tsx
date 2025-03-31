
import { memo } from "react";
import ReviewRowCard from "@/components/reviews/ReviewRowCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewsListProps {
  reviews: any[];
  isLoading: boolean;
  onEdit: (review: any) => void;
  onDelete: () => void;
}

const ReviewsList = memo(({ reviews, isLoading, onEdit, onDelete }: ReviewsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-full">
            <Skeleton className="w-full h-28 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // Add a debug log to see what reviews are being passed to the component
  console.log("Reviews being rendered in ReviewsList:", reviews);

  if (!reviews || reviews.length === 0) {
    return <div className="text-center text-gray-500">No reviews found</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewRowCard 
          key={review.id} 
          review={review} 
          onEdit={() => {
            console.log("Editing review with data:", review);
            onEdit(review);
          }}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});

ReviewsList.displayName = 'ReviewsList';

export default ReviewsList;
