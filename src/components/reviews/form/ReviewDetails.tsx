
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StarRating from "./StarRating";

type BrewingMethod = "Espresso" | "Chemex" | "Kalita" | "Aeropress" | "French Press" | "Pour Over (other)" | "Automatic Drip" | "";

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
  const brewingMethods: BrewingMethod[] = [
    "Espresso", 
    "Chemex", 
    "Kalita", 
    "Aeropress", 
    "French Press", 
    "Pour Over (other)",
    "Automatic Drip"
  ];

  return (
    <>
      <StarRating rating={rating} onRatingChange={setRating} />
      
      <div className="space-y-2">
        <label htmlFor="brewingMethod" className="block text-sm font-medium">
          Brewing Method
        </label>
        <Select 
          value={brewingMethod} 
          onValueChange={(value) => setBrewingMethod(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select brewing method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Select a method</SelectItem>
            {brewingMethods.map((method) => (
              <SelectItem key={method} value={method}>{method}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
