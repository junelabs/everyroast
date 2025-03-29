
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

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewRowCard 
          key={review.id} 
          review={review} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});

ReviewsList.displayName = 'ReviewsList';

export default ReviewsList;
