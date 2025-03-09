
import { Input } from "@/components/ui/input";
import StarRating from "./StarRating";

interface ReviewDetailsProps {
  rating: number;
  setRating: (rating: number) => void;
  brewingMethod: string;
  setBrewingMethod: (method: string) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
}

const ReviewDetails = ({
  rating,
  setRating,
  brewingMethod,
  setBrewingMethod,
  reviewText,
  setReviewText
}: ReviewDetailsProps) => {
  return (
    <>
      <StarRating rating={rating} onRatingChange={setRating} />
      
      <div className="space-y-2">
        <label htmlFor="brewingMethod" className="block text-sm font-medium">
          Brewing Method (optional)
        </label>
        <Input
          id="brewingMethod"
          placeholder="e.g., Pour Over, French Press, Espresso"
          value={brewingMethod}
          onChange={(e) => setBrewingMethod(e.target.value)}
        />
      </div>
      
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
