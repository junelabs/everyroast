
import { memo } from "react";
import ReviewCard from "@/components/reviews/ReviewCard";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <ReviewCard 
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
