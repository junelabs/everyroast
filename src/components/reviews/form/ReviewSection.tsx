
import ReviewDetails from "./ReviewDetails";

interface ReviewSectionProps {
  rating: number;
  setRating: (rating: number) => void;
  brewingMethod: string;
  setBrewingMethod: (method: string) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  showRatingError?: boolean;
}

const ReviewSection = ({
  rating,
  setRating,
  brewingMethod,
  setBrewingMethod,
  reviewText,
  setReviewText,
  showRatingError = false
}: ReviewSectionProps) => {
  return (
    <div className="space-y-4">
      <ReviewDetails
        rating={rating}
        setRating={setRating}
        brewingMethod={brewingMethod}
        setBrewingMethod={setBrewingMethod}
        reviewText={reviewText}
        setReviewText={setReviewText}
        showRatingError={showRatingError}
      />
    </div>
  );
};

export default ReviewSection;
