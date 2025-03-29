
import StarRating from "./StarRating";
import { Textarea } from "@/components/ui/textarea";

interface ReviewDetailsProps {
  rating: number;
  setRating: (rating: number) => void;
  brewingMethod: string;
  setBrewingMethod: (method: string) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  showRatingError?: boolean;
}

const ReviewDetails = ({
  rating,
  setRating,
  brewingMethod,
  setBrewingMethod,
  reviewText,
  setReviewText,
  showRatingError = false
}: ReviewDetailsProps) => {
  return (
    <>
      <StarRating rating={rating} onRatingChange={setRating} showError={showRatingError} />
      
      <div className="space-y-2">
        <Textarea
          id="reviewText"
          rows={4}
          placeholder="Share your thoughts about this coffee..."
          className="w-full"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </div>
    </>
  );
};

export default ReviewDetails;
