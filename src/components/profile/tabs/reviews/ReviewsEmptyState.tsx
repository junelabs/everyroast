
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewsEmptyStateProps {
  isLoading: boolean;
  error: Error | null;
  onAddReview: () => void;
}

const ReviewsEmptyState = ({ isLoading, error, onAddReview }: ReviewsEmptyStateProps) => {
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

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading reviews. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Share your thoughts on coffees you've tried to help the community.
        </p>
        <Button 
          onClick={onAddReview} 
          className="bg-roast-500 hover:bg-roast-600"
        >
          Write a Review
        </Button>
      </div>
    </div>
  );
};

export default ReviewsEmptyState;
