
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
        <label htmlFor="reviewText" className="block text-sm font-medium">
          Your Review
        </label>
        <textarea
          id="reviewText"
          rows={4}
          placeholder="Share your thoughts about this coffee..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-roast-500"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </div>
    </>
  );
};

export default ReviewDetails;
